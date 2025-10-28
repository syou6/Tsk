"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { classifyTask, getRandomLoadingMessage } from "@/lib/aiClassification";
import { createTask } from "./actions";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    quadrant: "A" | "B" | "C" | "D";
    confidence: number;
    reasoning: string;
  } | null>(null);

  const handleAIAnalysis = async () => {
    if (!title.trim()) return;

    setIsAnalyzing(true);
    setAiResult(null);

    // AIっぽい遅延を追加
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const classification = classifyTask(title);
    setAiResult(classification);
    
    // 自動的にフラグを設定（AI分類結果に基づく）
    const urgentValue = classification.quadrant === "A" || classification.quadrant === "C";
    const importantValue = classification.quadrant === "A" || classification.quadrant === "B";
    
    setUrgent(urgentValue);
    setImportant(importantValue);
    setIsAnalyzing(false);
  };

  const quadrantLabels = {
    A: "A: Ship Now (緊急・重要)",
    B: "B: Validate / Grow (重要・非緊急)",
    C: "C: Delegate / Automate (緊急・非重要)",
    D: "D: Drop (非緊急・非重要)"
  };

  return (
    <div className="space-y-6">
      <form action={createTask} className="grid gap-4 md:grid-cols-[1fr,180px]">
        <div className="space-y-2">
          <label htmlFor="title" className="text-base font-semibold text-muted-foreground md:text-lg">
            タスク名
          </label>
          <div className="flex gap-2">
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: Waitlist 向けオンボードメール改善"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none"
            />
            <Button
              type="button"
              onClick={handleAIAnalysis}
              disabled={!title.trim() || isAnalyzing}
              className="whitespace-nowrap"
            >
              {isAnalyzing ? "🤖 分析中..." : "🤖 AI分類"}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground md:text-base">
            <label className="inline-flex items-center gap-2">
              <input 
                type="checkbox" 
                id="urgent" 
                name="urgent" 
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="h-4 w-4 rounded border-border" 
              />
              緊急
            </label>
            <label className="inline-flex items-center gap-2">
              <input 
                type="checkbox" 
                id="important" 
                name="important" 
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="h-4 w-4 rounded border-border" 
              />
              重要
            </label>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <Button type="submit" className="w-full md:w-auto">
            タスクを追加
          </Button>
        </div>
      </form>

      {isAnalyzing && (
        <div className="rounded-lg border border-border bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-blue-700">{getRandomLoadingMessage()}</span>
          </div>
        </div>
      )}

      {aiResult && (
        <div className="rounded-lg border border-border bg-green-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-800">🤖 AI分析結果</h3>
              <span className="text-sm text-green-600">信頼度: {aiResult.confidence}%</span>
            </div>
            
            <div className="rounded-md bg-white p-3">
              <div className="font-medium text-gray-900">
                {quadrantLabels[aiResult.quadrant]}
              </div>
              <p className="mt-1 text-sm text-gray-600">{aiResult.reasoning}</p>
            </div>

            <div className="text-sm text-green-700">
              ✅ 緊急・重要フラグが自動設定されました
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
