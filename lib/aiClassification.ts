export type Quadrant = "A" | "B" | "C" | "D";

interface ClassificationResult {
  quadrant: Quadrant;
  confidence: number;
  reasoning: string;
}

// インディハッカー向けキーワード分類
const classificationKeywords = {
  A: {
    keywords: [
      "バグ", "エラー", "修正", "緊急", "ブロッカー", "動かない", "壊れた",
      "デプロイ", "本番", "サーバー", "ダウン", "ログイン", "認証",
      "決済", "支払い", "課金", "セキュリティ", "脆弱性", "ハッキング"
    ],
    description: "ローンチを止める致命的なブロッカー"
  },
  B: {
    keywords: [
      "機能", "新機能", "追加", "改善", "最適化", "パフォーマンス",
      "ユーザー", "体験", "UI", "UX", "デザイン", "マーケティング",
      "分析", "データ", "統計", "A/B", "テスト", "検証", "仮説",
      "収益", "売上", "コンバージョン", "リテンション", "成長"
    ],
    description: "ROIの高い検証・グロース施策"
  },
  C: {
    keywords: [
      "ドキュメント", "README", "コメント", "整理", "リファクタ",
      "設定", "環境", "セットアップ", "インストール", "依存関係",
      "メール", "通知", "アラート", "ログ", "監視", "バックアップ",
      "テスト", "単体テスト", "結合テスト", "E2E", "CI/CD"
    ],
    description: "任せられるOps・自動化候補"
  },
  D: {
    keywords: [
      "アイデア", "検討", "調査", "研究", "実験", "プロトタイプ",
      "将来", "後で", "いつか", "余裕", "時間", "暇",
      "趣味", "学習", "勉強", "練習", "試行錯誤"
    ],
    description: "影響が小さいタスク・バックログ"
  }
};

export function classifyTask(title: string): ClassificationResult {
  const lowerTitle = title.toLowerCase();
  
  // 各象限のスコアを計算
  const scores: Record<Quadrant, number> = { A: 0, B: 0, C: 0, D: 0 };
  
  for (const [quadrant, config] of Object.entries(classificationKeywords)) {
    for (const keyword of config.keywords) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrant as Quadrant] += 1;
      }
    }
  }
  
  // 最も高いスコアの象限を選択
  const maxScore = Math.max(...Object.values(scores));
  const bestQuadrant = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as Quadrant || "D";
  
  // 信頼度を計算（0-100%）
  const totalKeywords = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const confidence = totalKeywords > 0 ? Math.min(95, (maxScore / totalKeywords) * 100) : 30;
  
  // 推論理由を生成
  const reasoning = generateReasoning(bestQuadrant, scores, title);
  
  return {
    quadrant: bestQuadrant,
    confidence: Math.round(confidence),
    reasoning
  };
}

function generateReasoning(quadrant: Quadrant, scores: Record<Quadrant, number>, title: string): string {
  const config = classificationKeywords[quadrant];
  const maxScore = scores[quadrant];
  
  if (maxScore === 0) {
    return `「${title}」は明確な分類キーワードが見つからないため、D象限（${config.description}）に分類しました。`;
  }
  
  const matchedKeywords = Object.entries(classificationKeywords[quadrant].keywords)
    .filter(([_, keyword]) => title.toLowerCase().includes(keyword.toLowerCase()))
    .map(([_, keyword]) => keyword);
  
  if (matchedKeywords.length > 0) {
    return `「${matchedKeywords.join("、")}」のキーワードから、${config.description}として${quadrant}象限に分類しました。`;
  }
  
  return `AI分析により${config.description}として${quadrant}象限に分類しました。`;
}

// AIっぽいローディングメッセージ
export const aiLoadingMessages = [
  "タスクを分析中...",
  "キーワードを抽出中...",
  "インディハッカーパターンを検索中...",
  "最適な象限を計算中...",
  "AI判定を生成中...",
  "分類結果を最適化中..."
];

// ランダムなローディングメッセージを取得
export function getRandomLoadingMessage(): string {
  return aiLoadingMessages[Math.floor(Math.random() * aiLoadingMessages.length)];
}
