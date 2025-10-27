# EisenFlow 技術要件定義 (Draft)

最終更新: 2025-10-?? (仮)

## 1. 目的とスコープ
- **目的**: Eisenhower Matrix（緊急 × 重要）に基づくタスク管理を、AI による自動分類と共に提供し、特に B 象限（重要・非緊急）の課題解消を支援する。
- **ターゲット**: 20-40 代の忙しいプロフェッショナル（個人・小規模チーム）。
- **MVP スコープ**:
  - タスク CRUD
  - 象限表示 UI
  - OpenAI 連携による自動分類
- **将来拡張案**:
  - すき間時間マッチング (Google Calendar 連携)
  - 週次レポート / B 象限の可視化
  - ワークスペース共有、チームコラボ

## 2. 機能要件 (Functional Requirements)

| 機能ID | 機能名 | ユーザーストーリー | 実装要件 (Next.js / Supabase / Vercel) | 優先度 |
| ------ | ------ | ------------------- | -------------------------------------- | ------ |
| FR-01 | ユーザー認証 | ユーザーはメール/パスワードで登録・ログインし、セッションが維持される。 | Supabase Auth (createServerClient, cookies 対応)。Middleware で保護。RLS により `auth.uid() = user_id` 制限。 | 高 |
| FR-02 | タスク CRUD | ユーザーはタスクを追加/編集/削除/一覧表示し、緊急/重要フラグを手動設定できる。 | Supabase `tasks` テーブル。Next.js Server Actions で CRUD。Zod で入力検証。 | 高 |
| FR-03 | 象限表示 UI | タスクが A/B/C/D 象限グリッドに配置され、アクション提案が表示される。 | Tailwind グリッド。`quadrantFromFlags` ヘルパー。App Router ページで Server Components + Client コンポーネント。 | 高 |
| FR-04 | AI 自動分類 | タスクタイトルを入力し「AI分類」ボタンで、OpenAI が緊急/重要度を判定し自動登録する。 | Supabase Edge Function or Vercel AI Route。OpenAI GPT-4o, JSON mode。Zod でレスポンス検証。 | 高 |
| FR-05 | フィードバック & ログ | AI 成功/失敗をユーザーに通知し、開発者向けログを記録する。 | `react-hot-toast`。`console.log` + Supabase Logs。 | 中 |
| FR-06 | リアルタイム同期 | 別デバイスでもタスク更新が即反映される。 | Supabase Realtime (Postgres Changes)。`useEffect` で購読。 | 中 |
| FR-07 | (拡張) 週次ハイライト | 重要タスクのレポートを自動生成する。 | Supabase Functions + Scheduled Jobs。 | 低 |

## 3. 非機能要件 (Non-Functional Requirements)

| カテゴリ | 要件 | 詳細/測定基準 | 実装ヒント |
| -------- | ---- | ------------- | ---------- |
| パフォーマンス | 初回ロード < 2s、AI 応答 < 3s | Vercel Edge Network 配信。Supabase インデックス。 | Server Components 優先。Vercel Analytics 監視。 |
| セキュリティ | 認証必須、秘密情報保護 | Supabase RLS。Vercel 環境変数で API キー管理。 | `@supabase/ssr` + Middleware。WAF 有効化。 |
| スケーラビリティ | 日次 1k ユーザー想定 | Supabase オートスケール、Vercel Serverless。 | AI 呼び出しは Edge Functions でオフロード。 |
| アクセシビリティ | WCAG 2.1 AA 準拠 | キーボード操作、コントラスト 4.5:1。 | Tailwind + `aria-*`。`eslint-plugin-jsx-a11y`。 |
| 互換性 | 最新 Chrome/Edge/Firefox + モバイル | レスポンシブ + PWA 検討。 | Tailwind breakpoints。meta viewport。 |
| メンテナンス性 | ログ・エラー追跡 | Sentry/Bugsnag。 | Vercel Logs, Supabase Studio。 |

## 4. アーキテクチャ & 技術スタック

### 全体概要
- **フロント**: Next.js 15 App Router。Server Components でデータ取得、Client Components でフォーム・リアルタイム処理。
- **バックエンド**: Supabase (Postgres, Auth, Edge Functions)。Tasks テーブル、AI 呼び出し、Realtime。
- **デプロイ**: Vercel (GitHub 連携、Preview Branch)。Vercel AI SDK で OpenAI 利用。
- **外部サービス**: OpenAI (GPT-4o)。将来: Google Calendar API。

### 技術スタック一覧
| カテゴリ | ツール/ライブラリ | バージョン目安 | 用途 |
| -------- | ----------------- | ------------- | ---- |
| フレームワーク | Next.js | 15.x | App Router, Server Actions |
| DB/Auth | Supabase | 最新 | Auth, Postgres, Realtime |
| デプロイ | Vercel | 最新 | Preview, Edge Functions |
| UI | Tailwind CSS, shadcn/ui | 最新 | グリッド/フォーム |
| AI | OpenAI SDK, Vercel AI | 最新 | gpt-4o 連携 |
| 状態管理 | React Query or SWR | 最新 | タスク取得/キャッシュ |
| 通知 | react-hot-toast | 最新 | トースト表示 |
| 型/リント | TypeScript, ESLint | 最新 | 型・品質 |
| その他 | @supabase/ssr | 最新 | Supabase Server Client |

### データモデル案
```sql
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  urgent BOOLEAN DEFAULT false,
  important BOOLEAN DEFAULT false,
  quadrant TEXT GENERATED ALWAYS AS (
    CASE
      WHEN urgent AND important THEN 'A'
      WHEN important THEN 'B'
      WHEN urgent THEN 'C'
      ELSE 'D'
    END
  ) STORED,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

## 5. 開発 & デプロイ手順

1. **セットアップ**
   - Supabase プロジェクト作成 → `.env.local` に `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`。
   - `npx create-next-app@15 eisenflow --typescript --tailwind --eslint --app --src-dir`。
   - 依存追加: `npm i @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs openai ai zod react-hot-toast`。

2. **実装フロー**
   - 認証: `middleware.ts` で保護。`lib/supabase/server.ts` で Server Client。
   - DB: Supabase SQL Editor にモデル適用。RLS + Policy。
   - UI: `app/tasks/page.tsx` (Server Component) + `TaskForm` (Client Component)。
   - AI: Supabase Edge Function (`supabase/functions/classify-task/index.ts`) or Vercel Route (Edge Runtime)。プロンプト: `Analyze the task and respond JSON { urgent: boolean, important: boolean }`。
   - 通知/ログ: `react-hot-toast`、`console.log` + Supabase Logs。

3. **テスト & デプロイ**
   - `npm run dev` → ローカル確認。
   - GitHub プッシュ → Vercel Import。環境変数設定。
   - Preview で AI 自動分類 & Realtime を検証。本番に Promote。

## 6. 参考リソース (2025 年)
- Supabase Next.js ガイド: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- YouTube: [AI ノートアプリ構築ガイド (2025)](https://www.youtube.com/watch?v=6ChzCaljcaI)
- Medium: [Next.js + Supabase + OpenAI RAG チュートリアル (2025)](https://medium.com/@olliedoesdev/create-a-rag-application-using-next-js-supabase-and-openais-text-embedding-3-small-model-7f290c028766)
- YouTube: [AI ニュースレター SaaS ビルド](https://www.youtube.com/watch?v=1aZRT2cs7u0)

---

今後、この要件定義をベースにタスク分割・実装計画を行う。
