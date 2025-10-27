import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">お問い合わせ</span>
          </div>

          <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-foreground md:text-5xl">{siteConfig.contact.title}</h1>
            <p className="mt-4 text-base text-muted-foreground md:text-xl">{siteConfig.contact.description}</p>

            <div className="mt-8 space-y-4 rounded-xl border border-border bg-slate-50 p-6 text-sm text-slate-600">
              <p className="text-base font-semibold text-slate-900">
                {siteConfig.contact.successHeadline}
              </p>
              <p>{siteConfig.contact.successMessage}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full">
                  <Link href="/">ホームへ戻る</Link>
                </Button>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-500 hover:text-slate-600"
                >
                  メールを送る
                </a>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-xl border border-dashed border-border bg-slate-50 p-6 text-sm text-slate-600 md:text-base">
              <p>Slack や Zoom でのミーティングも可能です。ご希望の場合はメール本文にご記入ください。</p>
              <p>48 時間以内にプロダクトチームよりご連絡いたします。</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
