import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const items = [
  {
    title: "返金の可否",
    body: "返金ポリシー（全額返金／日割り返金／返金不可など）を明確に記載してください。ユーザーへ事前に条件を周知しておくとトラブル防止につながります。",
  },
  {
    title: "返金申請方法",
    body: "連絡先、必要情報（注文ID、メールアドレスなど）、申請期限（例: 購入後14日以内）を明記します。",
  },
  {
    title: "返金処理期間",
    body: "返金が承認されてからユーザーへ返金が反映されるまでの目安日数を記載してください（例: 7営業日）。",
  },
  {
    title: "例外事項",
    body: "カスタマイズ費用・導入支援費用など返金対象外の費目があれば記載してください。",
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="section-shell flex-1 py-16">
        <div className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">返金ポリシー</span>
        </div>

        <article className="mt-8 space-y-6">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold text-foreground">返金ポリシー（ひな型）</h1>
            <p className="text-sm text-muted-foreground">
              有料プラン導入時に備えたテンプレートです。貴社のビジネスモデルに合わせた内容へ書き換えてください。
            </p>
          </header>

          {items.map((item) => (
            <section key={item.title} className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
