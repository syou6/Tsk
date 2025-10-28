import { redirect } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { TaskBoard, type Task } from "./TaskBoard";
import { TaskForm } from "./TaskForm";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  let supabase;

  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    console.error("[tasks] Supabase client init failed", error);
    return (
      <div className="flex min-h-screen flex-col bg-slate-100">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Supabase の設定が見つかりません</h1>
          <p className="text-sm text-slate-600">
            `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定して、ページを再読み込みしてください。
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("id,title,urgent,important,quadrant,completed,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[tasks] fetch failed", error);
  }

  const tasks: Task[] = Array.isArray(data) ? (data as Task[]) : [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="section-shell flex-1 space-y-10 py-12">
        <div className="space-y-4 text-center">
          <span className="rounded-full border border-border px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Indie Hacker Sprint
          </span>
          <h1 className="text-4xl font-bold text-foreground md:text-6xl">AI × Eisenhower で毎週 MVP を ship</h1>
          <p className="text-base text-muted-foreground md:text-xl">
            タスクを登録すると AI がローンチブロッカーと検証タスクを判定。Ship / Validate / Delegate / Drop の 4 象限で次にやるべきことを決めましょう。
          </p>
        </div>

        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-foreground md:text-4xl">タスクを追加</h2>
          <p className="mt-3 text-base text-muted-foreground md:text-xl">
            MVP ビルド・マーケ・サポートのタスクを登録し、緊急 / 重要フラグをセット。AI 分類を有効にすればブロッカー抽出や ROI 推定も自動化できます。
          </p>
          
          <div className="mt-6">
            <TaskForm />
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">タスク一覧</h2>
            <p className="text-sm text-muted-foreground">
              Ship / Validate / Delegate / Drop の 4 象限で優先度を調整。ドラッグ＆ドロップで象限を移動すると、AI 判定と連携する履歴も更新されます。
            </p>
          </div>

          <TaskBoard initialTasks={tasks} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
