"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { classifyTask, getRandomLoadingMessage, type Quadrant } from "@/lib/aiClassification";

interface AIClassificationFormProps {
  onClassification: (quadrant: Quadrant, urgent: boolean, important: boolean) => void;
}

export function AIClassificationForm({ onClassification }: AIClassificationFormProps) {
  const [title, setTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    quadrant: Quadrant;
    confidence: number;
    reasoning: string;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!title.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    // AIっぽい遅延を追加
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const classification = classifyTask(title);
    setResult(classification);
    setIsAnalyzing(false);
  };

  const handleApply = () => {
    if (!result) return;

    const urgent = result.quadrant === "A" || result.quadrant === "C";
    const important = result.quadrant === "A" || result.quadrant === "B";
    
    onClassification(result.quadrant, urgent, important);
    setTitle("");
    setResult(null);
  };

  const quadrantLabels = {
    A: "A: Ship Now (緊急・重要)",
    B: "B: Validate / Grow (重要・非緊急)",
    C: "C: Delegate / Automate (緊急・非重要)",
    D: "D: Drop (非緊急・非重要)"
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: ログイン機能のバグ修正"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none"
        />
        <Button
          onClick={handleAnalyze}
          disabled={!title.trim() || isAnalyzing}
          className="whitespace-nowrap"
        >
          {isAnalyzing ? "🤖 分析中..." : "🤖 AI分類"}
        </Button>
      </div>

      {isAnalyzing && (
        <div className="rounded-lg border border-border bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-blue-700">{getRandomLoadingMessage()}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-border bg-green-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-800">🤖 AI分析結果</h3>
              <span className="text-sm text-green-600">信頼度: {result.confidence}%</span>
            </div>
            
            <div className="rounded-md bg-white p-3">
              <div className="font-medium text-gray-900">
                {quadrantLabels[result.quadrant]}
              </div>
              <p className="mt-1 text-sm text-gray-600">{result.reasoning}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApply} size="sm" className="bg-green-600 hover:bg-green-700">
                この分類を適用
              </Button>
              <Button 
                onClick={() => setResult(null)} 
                variant="outline" 
                size="sm"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
