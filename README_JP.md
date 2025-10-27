# EisenFlow - Indie Hacker 向け Eisenhower × AI タスク管理

EisenFlow は、Indie Hacker が毎週 MVP を ship するための Eisenhower Matrix アプリです。AI がローンチブロッカー・検証タスク・委任候補を判定し、Ship / Validate / Delegate / Drop の 4 象限で優先順位を提示します。Next.js 15 + Supabase + Vercel をベースに構築しており、シングル開発者のワークフローに最適化中です。

- ランディングページ (App Router) は `app/page.tsx`
- タスクボード本体は `/tasks` ページに実装予定
- 技術要件の詳細は `docs/eisenflow-requirements.md`

## 現状の構成と進行状況
- ✅ ランディングページ: EisenFlow 向けに刷新
- ✅ 共通 UI: Header / Footer / shadcn/ui ベースの UI コンポーネント
- ✅ タスク CRUD + Supabase 連携 (Server Actions)
- 🚧 AI 自動分類 (OpenAI Edge Function)
- ✅ 旧 Stripe / Resend 機能の削除

## 開発のはじめ方
```bash
npm install
npm run dev
# http://localhost:3000 を開く
```

`.env.local` には以下を想定しています（まだ未使用の値も含む）:

| 変数 | 用途 |
| ---- | ---- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase クライアント |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function からの DB 書き込み用 (AI 自動分類実装時に使用予定) |
| `OPENAI_API_KEY` | AI 自動分類で利用予定 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | フッター・お問い合わせ表示用 |

## ディレクトリ概要
```
app/
  (marketing)/page.tsx         # LP
  (marketing)/contact/page.tsx # メール案内のみの問い合わせページ
  (marketing)/legal/*          # ひな型ドキュメント
  (marketing)/success/page.tsx # ベータ加入案内
  (marketing)/cancel/page.tsx  # 決済未対応の案内
  (app)/dashboard/page.tsx     # ユーザーダッシュボード / AI プレイグラウンド
  (app)/tasks/page.tsx         # タスクボード (象限整理 + CRUD)
components/
  Header.tsx / Footer.tsx / ui/*
lib/
  siteConfig.ts     # LP 向け文言・設定
  supabaseClient.ts # ブラウザ用 Supabase クライアント
  supabaseServer.ts # Server Actions 用 Supabase クライアント
docs/
  eisenflow-requirements.md  # EisenFlow 技術要件ドラフト
```

## 次のアクション
1. AI Edge Function (JSON 出力) を実装し、タスク自動分類を組み込み
2. `/tasks` にタイトル編集や Realtime 同期などの UI 改善を追加
3. 認証まわりの UX（メール検証フローやエラー表示）をブラッシュアップ

フィードバックやアイデアがあれば issue / PR で歓迎です。
