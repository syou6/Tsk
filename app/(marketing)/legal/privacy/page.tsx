import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sections = [
  {
    title: "1. 収集する情報",
    body: "ユーザー登録時に取得する氏名、メールアドレスその他必要情報、サービス利用ログ、決済情報など、利用目的に応じて取得する個人情報を列挙してください。",
  },
  {
    title: "2. 利用目的",
    body: "本人確認、サービス提供、問い合わせ対応、利用状況の分析、重要なお知らせの配信など、具体的な利用目的を記載してください。",
  },
  {
    title: "3. 第三者提供・委託",
    body: "認証やメール配信などで利用する外部サービス（例: Supabase, メール配信プロバイダ）について、提供先と目的を明記してください。",
  },
  {
    title: "4. 保管期間・安全管理",
    body: "保存期間、アクセス権限管理、暗号化など安全管理措置について、自社の運用に合わせた内容を記載してください。",
  },
  {
    title: "5. 利用者の権利",
    body: "登録情報の開示・訂正・削除・利用停止など、ユーザーからの請求方法と連絡先を記載してください。",
  },
  {
    title: "6. Cookie・外部サービス",
    body: "Cookieの利用有無、解析ツール（例: Google Analytics）を利用する場合は目的とオプトアウト方法を記載してください。",
  },
  {
    title: "7. 改定",
    body: "プライバシーポリシーの改定方法、改定日時、通知方法を記載してください。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="section-shell flex-1 py-16">
        <div className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">プライバシーポリシー</span>
        </div>

        <article className="mt-8 space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold text-foreground">プライバシーポリシー（ひな型）</h1>
            <p className="text-sm text-muted-foreground">
              SaaS 公開時に必要となる項目を網羅できるよう構成しています。実際の運用に合わせて必ず編集してください。
            </p>
          </header>

          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{section.body}</p>
            </section>
          ))}

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">問い合わせ窓口</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              個人情報に関するお問い合わせは、専用窓口（例: privacy@example.com）を案内してください。`
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
