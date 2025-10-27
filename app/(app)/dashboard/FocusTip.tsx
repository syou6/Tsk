"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FocusTip() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-4 text-left text-sm text-muted-foreground md:text-base">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground md:text-lg">まずは Ship Now を片付けましょう</p>
          <p className="mt-2">
            A 象限に溜まったローンチブロッカーを朝イチで処理すると、残りの時間を検証タスクに回せます。B 象限は今週のカレンダーにブロックを確保しましょう。
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setHidden(true)}>
          完了
        </Button>
      </div>
    </div>
  );
}
