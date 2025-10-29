export type Quadrant = "A" | "B" | "C" | "D";

interface ClassificationResult {
  quadrant: Quadrant;
  confidence: number;
  reasoning: string;
}

// インディハッカー向け高度分類ロジック
const classificationPatterns: Record<Quadrant, {
  urgent?: string[];
  important?: string[];
  business?: string[];
  growth?: string[];
  marketing?: string[];
  strategic?: string[];
  ops?: string[];
  automation?: string[];
  management?: string[];
  lowPriority?: string[];
  personal?: string[];
  nonBusiness?: string[];
  description: string;
}> = {
  A: {
    // 緊急度の高いキーワード（重み: 3）
    urgent: [
      "バグ", "エラー", "修正", "緊急", "ブロッカー", "動かない", "壊れた", "ダウン", "落ちる", "止まる",
      "bug", "error", "fix", "urgent", "blocker", "broken", "down", "crash", "stop", "critical"
    ],
    // 重要度の高いキーワード（重み: 3）
    important: [
      "本番", "デプロイ", "サーバー", "ログイン", "認証", "決済", "支払い", "課金", "セキュリティ", "脆弱性",
      "production", "deploy", "server", "login", "auth", "payment", "billing", "security", "vulnerability"
    ],
    // ビジネス影響（重み: 2）
    business: [
      "売上", "収益", "顧客", "ユーザー", "サービス", "アプリ",
      "revenue", "sales", "customer", "user", "service", "app", "business"
    ],
    description: "ローンチを止める致命的なブロッカー"
  },
  B: {
    // 成長・改善キーワード（重み: 2）
    growth: [
      "機能", "新機能", "追加", "改善", "最適化", "パフォーマンス", "体験", "UI", "UX", "デザイン",
      "feature", "new feature", "add", "improve", "optimize", "performance", "experience", "design"
    ],
    // マーケティング・分析（重み: 2）
    marketing: [
      "マーケティング", "分析", "データ", "統計", "A/B", "テスト", "検証", "仮説", "コンバージョン", "リテンション",
      "marketing", "analytics", "data", "statistics", "ab test", "test", "validation", "hypothesis", "conversion", "retention"
    ],
    // 戦略的キーワード（重み: 1）
    strategic: [
      "戦略", "計画", "ロードマップ", "目標", "KPI", "指標",
      "strategy", "plan", "roadmap", "goal", "kpi", "metric"
    ],
    description: "ROIの高い検証・グロース施策"
  },
  C: {
    // 運用・保守キーワード（重み: 2）
    ops: [
      "ドキュメント", "README", "コメント", "整理", "リファクタ", "設定", "環境", "セットアップ",
      "documentation", "readme", "comment", "refactor", "setup", "config", "environment"
    ],
    // 自動化・効率化（重み: 2）
    automation: [
      "自動化", "CI/CD", "デプロイ", "テスト", "単体テスト", "結合テスト", "E2E",
      "automation", "cicd", "deploy", "test", "unit test", "integration test", "e2e"
    ],
    // 管理・監視（重み: 1）
    management: [
      "メール", "通知", "アラート", "ログ", "監視", "バックアップ", "メンテナンス",
      "email", "notification", "alert", "log", "monitor", "backup", "maintenance"
    ],
    description: "任せられるOps・自動化候補"
  },
  D: {
    // 低優先度キーワード（重み: 1）
    lowPriority: [
      "アイデア", "検討", "調査", "研究", "実験", "プロトタイプ", "将来", "後で", "いつか",
      "idea", "consider", "research", "experiment", "prototype", "future", "later", "someday"
    ],
    // 個人的・学習（重み: 1）
    personal: [
      "趣味", "学習", "勉強", "練習", "試行錯誤", "遊び", "実験的",
      "hobby", "learning", "study", "practice", "trial", "play", "experimental"
    ],
    // 非業務キーワード（重み: 2）
    nonBusiness: [
      "歯磨き", "睡眠", "食事", "おやつ", "休憩", "散歩", "運動",
      "brush teeth", "sleep", "eat", "snack", "break", "walk", "exercise", "personal"
    ],
    description: "影響が小さいタスク・バックログ"
  }
};

export function classifyTask(title: string): ClassificationResult {
  const lowerTitle = title.toLowerCase();
  
  // 各象限のスコアを計算（重み付き）
  const scores: Record<Quadrant, number> = { A: 0, B: 0, C: 0, D: 0 };
  
  for (const [quadrant, patterns] of Object.entries(classificationPatterns)) {
    const quadrantKey = quadrant as Quadrant;
    
    // 緊急度チェック（重み: 3）
    for (const keyword of patterns.urgent || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 3;
      }
    }
    
    // 重要度チェック（重み: 3）
    for (const keyword of patterns.important || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 3;
      }
    }
    
    // ビジネス影響チェック（重み: 2）
    for (const keyword of patterns.business || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 2;
      }
    }
    
    // 成長・改善チェック（重み: 2）
    for (const keyword of patterns.growth || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 2;
      }
    }
    
    // マーケティング・分析チェック（重み: 2）
    for (const keyword of patterns.marketing || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 2;
      }
    }
    
    // 運用・保守チェック（重み: 2）
    for (const keyword of patterns.ops || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 2;
      }
    }
    
    // 自動化チェック（重み: 2）
    for (const keyword of patterns.automation || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 2;
      }
    }
    
    // 非業務キーワードチェック（重み: 2）
    for (const keyword of patterns.nonBusiness || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 2;
      }
    }
    
    // その他のキーワード（重み: 1）
    for (const keyword of patterns.strategic || patterns.management || patterns.lowPriority || patterns.personal || []) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        scores[quadrantKey] += 1;
      }
    }
  }
  
  console.log("Advanced scores for", title, ":", scores);
  
  // 最も高いスコアの象限を選択
  const maxScore = Math.max(...Object.values(scores));
  let bestQuadrant: Quadrant;
  
  if (maxScore === 0) {
    // キーワードが見つからない場合はD象限
    bestQuadrant = "D";
  } else {
    // 最も高いスコアの象限を選択
    const entries = Object.entries(scores) as [Quadrant, number][];
    bestQuadrant = entries.find(([_, score]) => score === maxScore)?.[0] || "D";
  }
  
  console.log("Max score:", maxScore, "Best quadrant:", bestQuadrant);
  
  // 信頼度を計算（0-100%）
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const confidence = totalScore > 0 ? Math.min(95, (maxScore / totalScore) * 100) : 30;
  
  // 推論理由を生成
  const reasoning = generateAdvancedReasoning(bestQuadrant, scores, title);
  
  return {
    quadrant: bestQuadrant,
    confidence: Math.round(confidence),
    reasoning
  };
}

function generateAdvancedReasoning(quadrant: Quadrant, scores: Record<Quadrant, number>, title: string): string {
  const patterns = classificationPatterns[quadrant];
  const maxScore = scores[quadrant];
  
  if (maxScore === 0) {
    return `「${title}」は明確な分類キーワードが見つからないため、D象限（影響が小さいタスク・バックログ）に分類しました。`;
  }
  
  // マッチしたキーワードを収集
  const matchedKeywords: string[] = [];
  const lowerTitle = title.toLowerCase();
  
  // 各カテゴリからマッチしたキーワードを収集
  const categories = [
    { keywords: patterns.urgent || [], weight: 3, name: "緊急度" },
    { keywords: patterns.important || [], weight: 3, name: "重要度" },
    { keywords: patterns.business || [], weight: 2, name: "ビジネス影響" },
    { keywords: patterns.growth || [], weight: 2, name: "成長・改善" },
    { keywords: patterns.marketing || [], weight: 2, name: "マーケティング" },
    { keywords: patterns.ops || [], weight: 2, name: "運用・保守" },
    { keywords: patterns.automation || [], weight: 2, name: "自動化" },
    { keywords: patterns.nonBusiness || [], weight: 2, name: "非業務" },
    { keywords: patterns.strategic || [], weight: 1, name: "戦略" },
    { keywords: patterns.management || [], weight: 1, name: "管理" },
    { keywords: patterns.lowPriority || [], weight: 1, name: "低優先度" },
    { keywords: patterns.personal || [], weight: 1, name: "個人的" }
  ];
  
  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }
  }
  
  if (matchedKeywords.length > 0) {
    const topKeywords = matchedKeywords.slice(0, 3).join("、");
    return `「${topKeywords}」のキーワードから、${patterns.description}として${quadrant}象限に分類しました。`;
  }
  
  return `AI分析により${patterns.description}として${quadrant}象限に分類しました。`;
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
