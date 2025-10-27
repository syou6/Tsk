import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sections = [
  {
    title: "第1条（適用）",
    body: "この利用規約（以下、本規約）は、貴社が提供するサービス（以下、本サービス）の利用条件を定めるものです。購入者は本規約に同意のうえ、本サービスを利用するものとします。",
  },
  {
    title: "第2条（利用登録）",
    body: "利用者は所定の登録手続を行い、当社が承認することで利用契約が成立します。登録情報に虚偽があった場合、利用停止の対象となります。",
  },
  {
    title: "第3条（禁止事項）",
    body: "本サービスのリバースエンジニアリング、再販、第三者への共有、法令または公序良俗に反する行為を禁止します。詳細は自社のルールに合わせて更新してください。",
  },
  {
    title: "第4条（利用料金と支払方法）",
    body: "将来的な有料プランの導入を想定し、料金・課金タイミング・解約方法・返金ポリシーを明記してください。",
  },
  {
    title: "第5条（免責事項）",
    body: "サービスの停止・変更・中断により利用者に生じた損害について、故意または重過失がない限り責任を負いません。クラウドサービス利用時の注意点を記載してください。",
  },
  {
    title: "第6条（契約期間・解約）",
    body: "契約期間、解約方法、解約時の扱い（即時停止、返金可否）を記載してください。解約申請窓口や目安工数を明記するとユーザーにとって親切です。",
  },
  {
    title: "第7条（準拠法・裁判管轄）",
    body: "本サービスに関する紛争は、貴社所在地の管轄裁判所を専属的合意管轄とします。",
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="section-shell flex-1 py-16">
        <div className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">利用規約</span>
        </div>

        <article className="mt-8 space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold text-foreground">利用規約（ひな型）</h1>
            <p className="text-sm text-muted-foreground">
              公開サイト用の雛形です。貴社のビジネス内容とプラン構成に合わせて必ず編集してください。
            </p>
          </header>

          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{section.body}</p>
            </section>
          ))}

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">特定商取引法に基づく表示について</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              特定商取引法の表示ページを別途用意する場合は、この利用規約と合わせてフッターからリンクしてください。所在地・責任者・連絡先・お支払い方法・引き渡し時期・返品についてなどを明記します。
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
