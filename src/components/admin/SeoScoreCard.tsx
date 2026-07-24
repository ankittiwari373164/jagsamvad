import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { calculateSeoScore } from "@/lib/seo-score";
import type { Article } from "@/lib/types";

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default function SeoScoreCard({ article }: { article: Article }) {
  const { score, checks } = calculateSeoScore(article);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">SEO Score</h2>
        <span className={`text-2xl font-bold ${scoreColor(score)}`}>{score}/100</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500 pb-2 border-b border-slate-100">
        <Eye size={14} />
        {(article.views ?? 0).toLocaleString("en-IN")} views
      </div>

      <ul className="space-y-2">
        {checks.map((check) => (
          <li key={check.label} className="flex items-start gap-2 text-sm">
            {check.passed ? (
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={16} className="text-slate-300 shrink-0 mt-0.5" />
            )}
            <span className={check.passed ? "text-slate-700" : "text-slate-400"}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
        Recalculated automatically every time you save this article.
      </p>
    </div>
  );
}