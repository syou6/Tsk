"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIClassificationForm } from "./AIClassificationForm";
import { createTask } from "./actions";

export function TaskForm() {
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);

  const handleAIClassification = (quadrant: "A" | "B" | "C" | "D", urgentValue: boolean, importantValue: boolean) => {
    setUrgent(urgentValue);
    setImportant(importantValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">🤖 AI自動分類</h3>
        <AIClassificationForm onClassification={handleAIClassification} />
      </div>

      <form action={createTask} className="grid gap-4 md:grid-cols-[1fr,180px]">
        <div className="space-y-2">
          <label htmlFor="title" className="text-base font-semibold text-muted-foreground md:text-lg">
            タスク名
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="例: Waitlist 向けオンボードメール改善"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none"
          />
          <div className="flex items-center gap-4 text-sm text-muted-foreground md:text-base">
            <label className="inline-flex items-center gap-2">
              <input 
                type="checkbox" 
                id="urgent" 
                name="urgent" 
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="h-4 w-4 rounded border-border" 
              />
              緊急
            </label>
            <label className="inline-flex items-center gap-2">
              <input 
                type="checkbox" 
                id="important" 
                name="important" 
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="h-4 w-4 rounded border-border" 
              />
              重要
            </label>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <Button type="submit" className="w-full md:w-auto">
            タスクを追加
          </Button>
        </div>
      </form>
    </div>
  );
}
