"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { setTaskQuadrant, updateTask, deleteTask, type Quadrant } from "./actions";

export type Task = {
  id: string;
  title: string;
  urgent: boolean;
  important: boolean;
  quadrant: Quadrant | null;
  created_at: string;
};

const quadrantOrder: Quadrant[] = ["A", "B", "C", "D"];

const quadrantMeta: Record<Quadrant, { title: string; description: string; accent: string }> = {
  A: {
    title: "A: Ship Now",
    description: "ローンチを止める致命的なブロッカー。最優先で解消。",
    accent: "border-red-200 bg-red-50",
  },
  B: {
    title: "B: Validate / Grow",
    description: "ROI の高い検証・グロース施策。時間をブロックして進める。",
    accent: "border-emerald-200 bg-emerald-50",
  },
  C: {
    title: "C: Delegate / Automate",
    description: "任せられる Ops。自動化・外注でビルド時間を確保。",
    accent: "border-amber-200 bg-amber-50",
  },
  D: {
    title: "D: Drop",
    description: "影響が小さいタスク。思い切って backlog から外す。",
    accent: "border-slate-200 bg-slate-50",
  },
};

function deriveQuadrant(task: Task): Quadrant {
  if (task.quadrant && quadrantOrder.includes(task.quadrant)) {
    return task.quadrant;
  }

  if (task.urgent && task.important) return "A";
  if (task.important) return "B";
  if (task.urgent) return "C";
  return "D";
}

interface TaskBoardProps {
  initialTasks: Task[];
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel("public:tasks")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        setTasks((prev) => {
          const current = [...prev];

          if (payload.eventType === "DELETE" && payload.old?.id) {
            return current.filter((task) => task.id !== payload.old.id);
          }

          if (payload.new) {
            const nextTask: Task = payload.new as Task;
            const index = current.findIndex((task) => task.id === nextTask.id);
            if (index >= 0) {
              current[index] = nextTask;
            } else {
              current.unshift(nextTask);
            }
          }

          return current;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const grouped = useMemo(() => {
    const buckets: Record<Quadrant, Task[]> = {
      A: [],
      B: [],
      C: [],
      D: [],
    };

    for (const task of tasks) {
      const quadrant = deriveQuadrant(task);
      buckets[quadrant].push(task);
    }

    return buckets;
  }, [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceQuadrant = source.droppableId as Quadrant;
    const destinationQuadrant = destination.droppableId as Quadrant;

    if (sourceQuadrant === destinationQuadrant && source.index === destination.index) {
      return;
    }

    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === draggableId
          ? {
              ...task,
              urgent: destinationQuadrant === "A" || destinationQuadrant === "C",
              important: destinationQuadrant === "A" || destinationQuadrant === "B",
              quadrant: destinationQuadrant,
            }
          : task,
      );
      return updated;
    });

    startTransition(async () => {
      await setTaskQuadrant(draggableId, destinationQuadrant);
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-6 lg:grid-cols-2">
        {quadrantOrder.map((quadrant) => {
          const taskList = grouped[quadrant];
          const meta = quadrantMeta[quadrant];

          return (
            <Droppable key={quadrant} droppableId={quadrant}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-3xl border bg-background p-6 shadow-sm transition ${meta.accent} ${
                    snapshot.isDraggingOver ? "ring-2 ring-brand" : ""
                  }`}
                >
                  <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-foreground md:text-3xl">{meta.title}</h3>
            <p className="text-sm text-muted-foreground md:text-base">{meta.description}</p>
                  </div>

                  {taskList.length === 0 ? (
                    <p className="mt-6 text-base text-muted-foreground">ドラッグしてタスクを追加しましょう。</p>
                  ) : (
                    <ul className="mt-6 space-y-3">
                      {taskList.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <li
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`rounded-2xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur transition ${
                                dragSnapshot.isDragging ? "ring-2 ring-brand" : ""
                              }`}
                            >
                              <div className="flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold text-foreground md:text-lg">{task.title}</p>
                    <span className="text-xs text-muted-foreground md:text-sm">{new Date(task.created_at).toLocaleString("ja-JP", {
                                    month: "short",
                                    day: "numeric",
                                  })}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <form action={updateTask}>
                                    <input type="hidden" name="id" value={task.id} />
                                    <input type="hidden" name="urgent" value={(!task.urgent).toString()} />
                                    <input type="hidden" name="important" value={task.important.toString()} />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={task.urgent ? "border-red-300 bg-red-100 text-red-700" : ""}
                                      disabled={isPending}
                                    >
                                      緊急 {task.urgent ? "ON" : "OFF"}
                                    </Button>
                                  </form>
                                  <form action={updateTask}>
                                    <input type="hidden" name="id" value={task.id} />
                                    <input type="hidden" name="urgent" value={task.urgent.toString()} />
                                    <input type="hidden" name="important" value={(!task.important).toString()} />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={task.important ? "border-emerald-300 bg-emerald-100 text-emerald-700" : ""}
                                      disabled={isPending}
                                    >
                                      重要 {task.important ? "ON" : "OFF"}
                                    </Button>
                                  </form>
                                  <form action={deleteTask}>
                                    <input type="hidden" name="id" value={task.id} />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-muted-foreground hover:text-destructive"
                                      disabled={isPending}
                                    >
                                      削除
                                    </Button>
                                  </form>
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
