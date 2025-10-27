const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL && process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()
  ? process.env.NEXT_PUBLIC_CONTACT_EMAIL
  : "support@eisenflow.app";

export const siteConfig = {
  name: "EisenFlow",
  brandMark: "EF",
  contactEmail,
  navigation: [
    { label: "概要", href: "#overview" },
    { label: "タスクボード", href: "/tasks" },
    { label: "マトリクス", href: "#matrix" },
    { label: "機能", href: "#features" },
    { label: "AI連携", href: "#ai" },
    { label: "ロードマップ", href: "#roadmap" },
    { label: "お問い合わせ", href: "/contact" },
  ],
  hero: {
    eyebrow: "Indie Hacker 専用",
    heading: "毎週 MVP を出荷するための EisenFlow",
    subheading:
      "アイデア検証・ビルド・マーケの全タスクがいつの間にか urgent になっていませんか？" +
      "EisenFlow は AI で優先順位を再計算し、Indie Hacker が次に ship すべき 3 つを象限で提示します。",
    primaryCta: { label: "ベータに参加する", href: "/auth/signup" },
    secondaryCta: { label: "コンセプトを読む", href: "#matrix" },
    badges: ["MVPスプリント", "AI優先順位"]
  },
  highlights: [
    { label: "検証サイクル", value: "1week" },
    { label: "B象限着手率", value: "+42%" },
    { label: "GitHub同期", value: "近日" },
  ],
  matrix: {
    title: "Indie Hacker のための Eisenhower マトリクス",
    description:
      "ローンチブロッカー・検証タスク・委任したい雑務・捨てて良いアイデアを 4 象限で整理。" +
      "AI が『ユーザー価値 × 緊急度』のバランスを計算し、毎週の ship プランを支援します。",
    quadrants: [
      { id: "A", title: "Ship Now", description: "ローンチを止める致命的タスク。例: 決済バグ修正、デプロイ手順。" },
      { id: "B", title: "Validate & Grow", description: "重要だけど後回しになりがちな検証・グロース施策。ユーザーインタビュー、新LPなど。" },
      { id: "C", title: "Delegate / Automate", description: "SaaS運用やサポートの雑務。Zapierやフリーランスに任せてビルド時間を確保。" },
      { id: "D", title: "Drop", description: "バズ待ちのアイデアや見送っても影響がない雑タスク。捨てて集中を取り戻す。" },
    ],
  },
  features: [
    {
      icon: "⚡️",
      title: "AI でローンチブロッカー抽出",
      description: "タスクを投げるだけで gpt-4o が『今週 ship を止める項目か？』を判定し、象限と提案アクションを表示。",
    },
    {
      icon: "🗂️",
      title: "象限フォーカス + スプリントカード",
      description: "今日やるべき Ship リスト・今週の Validate タスク・来週に回す Backlog をワンクリックで切り替え。",
    },
    {
      icon: "📈",
      title: "80/20 ROI スコア",
      description: "B 象限タスクには『LTV/時間』スコアを計算。少ない労力で大きいリターンが見込めるタスクを提示。",
    },
    {
      icon: "🤝",
      title: "Indie Stack 連携 (拡張予定)",
      description: "GitHub Issues や Tweet アイデアをインポートし、自動で象限振り分け。Zapier / Linear 連携も計画中。",
    },
  ],
  aiFlow: {
    title: "Indie Hacker のための AI ワークフロー",
    description:
      "OpenAI GPT-4o と Vercel AI SDK を活用し、タスクを『Launch Blocker』『Validation』『Ops』などインディ特有のカテゴリで判定。" +
      "信頼度スコアと推奨アクションを保存して、週次レビューで再利用します。",
    steps: [
      "1. タスクを入力（例: 'Waitlist向けオンボードメール改善'）",
      "2. Edge Function が OpenAI に 'Indie Hacker 視点で象限分類' をリクエスト",
      "3. 緊急度・重要度・ROI スコア・推奨アクションを JSON で受信",
      "4. 象限ビューに即反映。Ship ボードと週次レポートへ同期",
    ],
  },
  useCases: [
    {
      title: "ソロ SaaS ファウンダー",
      description: "新機能開発、顧客対応、マーケティングのバランスを AI に任せて、毎週の出荷を安定させる。",
    },
    {
      title: "ノーコードインディメーカー",
      description: "Bubble / Webflow での実装タスクとユーザーインタビューを象限で可視化。B 象限の検証を逃さない。",
    },
    {
      title: "サイドプロジェクトハッカー",
      description: "本業の合間に週末で進めるタスクを整理。AI が ROI の低い雑務を D 象限へ自動送致。",
    },
  ],
  roadmap: {
    title: "ロードマップ",
    items: [
      { label: "Phase 1", headline: "Indie ベータ", details: "AI分類・ROIスコア・週次レポートを公開。" },
      { label: "Phase 2", headline: "GitHub & Linear 連携", details: "Issue インポートとスプリントボードを追加。" },
      { label: "Phase 3", headline: "Revenue Ops モード", details: "請求・サポートタスクを象限管理し、チーム共有機能を提供。" },
    ],
  },
  contact: {
    title: "お問い合わせ",
    description:
      "Indie Hacker からのフィードバックを歓迎しています。機能リクエストやインタビュー希望はメールまたは X の DM でご連絡ください。",
    successHeadline: "メールでのお問い合わせ",
    successMessage: "support チームが内容を確認し、48 時間以内にご返信いたします。",
    submitLabel: "送信する",
  },
  faq: [
    {
      question: "AI の分類結果はどの程度正確ですか？",
      answer: "OpenAI GPT-4o の JSON モードを使用し、追加のバリデーションで緊急度・重要度を判定します。誤りがあっても手動で即修正可能です。",
    },
    {
      question: "データはどこに保存されますか？",
      answer: "Supabase の Postgres に保存され、ユーザーごとに RLS で保護されます。データは Vercel 経由で暗号化された接続でやり取りされます。",
    },
    {
      question: "今後の料金体系は？",
      answer: "MVP リリース時点ではベータ利用者は無料を予定。正式ローンチ時にパーソナル/チーム向けプランを公開します。",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
