import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-emerald-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            ✓
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900 md:text-5xl">EisenFlow ベータへようこそ！</h1>
          <p className="mt-4 text-base text-slate-600 md:text-xl">
            現在のベータ版では料金プランや決済は提供していません。タスクボードと AI プレイグラウンドを自由にお試しいただけます。
          </p>
          <p className="mt-2 text-sm text-slate-500 md:text-base">
            ご意見・ご要望は <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> までお気軽にお寄せください。
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-dark md:text-lg"
          >
            ダッシュボードへ進む
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
