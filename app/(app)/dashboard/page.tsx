"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AiPlayground } from "@/components/AiPlayground";
import { getSupabaseBrowserClient, type Session } from "@/lib/supabaseClient";
import { FocusTip } from "./FocusTip";

export const dynamic = "force-dynamic";

const QUADRANTS = ["A", "B", "C", "D"] as const;

type Quadrant = (typeof QUADRANTS)[number];

type TaskRow = {
  id: string;
  title: string;
  urgent: boolean;
  important: boolean;
  quadrant: Quadrant | null;
  created_at: string;
};

const quadrantMeta: Record<Quadrant, { title: string; hint: string; accent: string }> = {
  A: {
    title: "A: Ship Now",
    hint: "ローンチを止めるブロッカー。まずはここをクリア",
    accent: "border-red-200 bg-red-50 text-red-700",
  },
  B: {
    title: "B: Validate / Grow",
    hint: "ROI の高い検証・グロース施策。今週ブロックを確保",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  C: {
    title: "C: Delegate / Automate",
    hint: "Zapierや外注で片付けるOpsタスク。自動化候補を確認",
    accent: "border-amber-200 bg-amber-50 text-amber-700",
  },
  D: {
    title: "D: Drop",
    hint: "影響の小さいアイデア。思い切って backlog から外す",
    accent: "border-slate-200 bg-slate-100 text-slate-500",
  },
};

function fallbackQuadrant(task: TaskRow): Quadrant {
  if (task.quadrant && QUADRANTS.includes(task.quadrant)) {
    return task.quadrant;
  }
  if (task.urgent && task.important) return "A";
  if (task.important) return "B";
  if (task.urgent) return "C";
  return "D";
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskRow[]>([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const hydrateSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session ?? null;
      setSession(currentSession);

      if (!currentSession) {
        setLoading(false);
        router.replace("/auth/login");
        return;
      }

      setLoading(false);
      toast.success("ようこそ、MVP モードへ！", { id: "welcome-toast" });
    };

    void hydrateSession();

    const authListener = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        router.replace("/auth/login");
      }
    });

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, [router, supabase]);

  useEffect(() => {
    if (!supabase || !session) return;

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id,title,urgent,important,quadrant,created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("[dashboard] failed to fetch tasks", error);
        return;
      }

      setTasks((data ?? []) as TaskRow[]);
    };

    void fetchTasks();
  }, [session, supabase]);

  const summary = useMemo(() => {
    const counts: Record<Quadrant, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    for (const task of tasks) {
      const quadrant = fallbackQuadrant(task);
      counts[quadrant] += 1;
    }

    return counts;
  }, [tasks]);

  if (!supabase) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-100">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Supabase の接続情報が見つかりません</h1>
          <p className="text-sm text-slate-600">
            `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定したあと、開発サーバーを再起動してください。
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <span className="text-sm text-slate-500">ダッシュボードを読み込んでいます...</span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-12">
        <section className="space-y-5">
          <div className="space-y-3">
            <span className="rounded-full border border-border px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Indie Hacker Cockpit
            </span>
            <h1 className="text-4xl font-bold text-slate-900 md:text-6xl">こんにちは、{session.user.email ?? "Indie Hacker"} さん</h1>
            <p className="text-base text-slate-600 md:text-xl">
              今週 ship するプロダクト、検証すべき仮説、任せたい Ops を 4 象限で把握しましょう。AI がローンチブロッカーを監視し、B 象限の先送りを防ぎます。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/tasks">タスクボードを開く</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">プロダクト概要を見る</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {QUADRANTS.map((quadrant) => {
            const meta = quadrantMeta[quadrant];
            const count = summary[quadrant];
            return (
              <div key={quadrant} className={`rounded-3xl border p-6 shadow-sm ${meta.accent}`}>
                <h3 className="text-base font-semibold md:text-xl">{meta.title}</h3>
                <p className="mt-2 text-xs opacity-80 md:text-sm">{meta.hint}</p>
                <p className="mt-6 text-3xl font-bold md:text-4xl">{count}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-foreground md:text-4xl">最近のタスク</h2>
                <p className="text-base text-muted-foreground">最新 10 件のタスクを表示しています。</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tasks">すべて見る</Link>
              </Button>
            </div>

            {tasks.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-slate-50 p-8 text-center text-sm text-muted-foreground">
                まだタスクがありません。まずはタスクボードで最初のタスクを追加しましょう。
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {tasks.slice(0, 10).map((task) => {
                  const quadrant = fallbackQuadrant(task);
                  return (
                    <li key={task.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-base font-semibold text-foreground md:text-lg">{task.title}</p>
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold md:text-sm ${quadrantMeta[quadrant].accent}`}>
                            象限 {quadrant}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground md:text-sm">{formatDate(task.created_at)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground md:text-4xl">今日のフォーカスヒント</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-xl">
                B 象限が 3 件以上溜まっていれば、今週のカレンダーに検証ブロックを予約。A 象限は朝イチで処理してローンチの詰まりを解消しましょう。
              </p>
              <FocusTip />
            </div>

            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground md:text-4xl">AI プレイグラウンド</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-xl">
                Indie Hacker 向けに調整したプロンプトで、MVPタスク分類やコピー生成をテストできます。ローンチ前のアイデア検証にもどうぞ。
              </p>
              <div className="mt-4">
                <AiPlayground />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
