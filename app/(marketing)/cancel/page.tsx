import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            !
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900 md:text-5xl">まだ決済は必要ありません</h1>
          <p className="mt-4 text-base text-slate-600 md:text-xl">
            EisenFlow ベータ版では有料プランや決済機能を提供していません。すべての機能を無料でお試しいただけます。
          </p>
          <p className="mt-2 text-sm text-slate-500 md:text-base">
            正式リリース時のプランや料金については、決まり次第お知らせいたします。ご質問は {siteConfig.contactEmail} までご連絡ください。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 hover:border-brand hover:text-brand md:text-lg"
            >
              ホームに戻る
            </Link>
            <Link
              href="/tasks"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-dark md:text-lg"
            >
              タスクボードを開く
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
