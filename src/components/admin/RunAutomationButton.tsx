"use client";

import { useState, useTransition } from "react";
import { Play, Loader2 } from "lucide-react";
import { triggerSeoAutomation } from "@/app/actions/seo";

export default function RunAutomationButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const handleRun = () => {
    setResult(null);
    startTransition(async () => {
      const res = await triggerSeoAutomation();
      setResult(
        res.ran
          ? `Done — updated ${res.articlesUpdated ?? 0} article(s).`
          : res.reason ?? "Skipped."
      );
    });
  };

  return (
    <div className="flex items-center gap-3">
      {result && <span className="text-xs text-slate-500">{result}</span>}
      <button
        onClick={handleRun}
        disabled={isPending}
        className="flex items-center gap-2 text-xs font-semibold bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        {isPending ? "Running…" : "Run Now"}
      </button>
    </div>
  );
}