import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import RunAutomationButton from "@/components/admin/RunAutomationButton";
import { Sparkles, Clock, AlertTriangle } from "lucide-react";

export default async function AdminSeoPage() {
  const supabase = await createClient();

  let lastRun: { run_at: string; articles_updated: number } | null = null;
  let recentRuns: { id: string; run_at: string; articles_updated: number; keywords_used: string[] }[] = [];
  let keywords: { keyword: string; score: number; fetched_at: string }[] = [];
  let setupError: string | null = null;

  try {
    const [lastRunRes, recentRunsRes, keywordsRes] = await Promise.all([
      supabase
        .from("seo_automation_runs")
        .select("*")
        .order("run_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("seo_automation_runs")
        .select("*")
        .order("run_at", { ascending: false })
        .limit(10),
      supabase
        .from("trending_keywords")
        .select("keyword, score, fetched_at")
        .order("fetched_at", { ascending: false })
        .limit(20),
    ]);

    if (lastRunRes.error && lastRunRes.error.code !== "PGRST116") throw lastRunRes.error;
    if (recentRunsRes.error) throw recentRunsRes.error;
    if (keywordsRes.error) throw keywordsRes.error;

    lastRun = lastRunRes.data;
    recentRuns = recentRunsRes.data ?? [];
    keywords = keywordsRes.data ?? [];
  } catch (err) {
    setupError =
      err instanceof Error
        ? err.message
        : "Could not load SEO automation data.";
  }

  if (setupError) {
    return (
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">SEO Automation</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-2">
              This feature isn&rsquo;t set up yet.
            </p>
            <p className="text-sm text-amber-800 mb-3">
              This page needs the <code className="bg-amber-100 px-1 rounded">trending_keywords</code> and{" "}
              <code className="bg-amber-100 px-1 rounded">seo_automation_runs</code> tables, which are created
              by a database migration — and the automation itself needs a{" "}
              <code className="bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> environment variable
              set in Vercel. If you&rsquo;ve done both already and still see this, double-check the key is set
              for the <strong>Production</strong> environment specifically, then redeploy.
            </p>
            <p className="text-xs text-amber-700 font-mono bg-amber-100/60 rounded p-2 break-all">
              {setupError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // This is an async Server Component computed once per request, not a
  // client re-render — the "impure during render" concern this lint rule
  // targets doesn't apply here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const hoursSinceLastRun = lastRun?.run_at
    ? (now - new Date(lastRun.run_at).getTime()) / 36e5
    : null;
  const nextRunIn = hoursSinceLastRun !== null ? Math.max(0, 20 - hoursSinceLastRun) : null;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">SEO Automation</h1>
      <p className="text-sm text-slate-500 mb-8">
        Runs automatically roughly every 20 hours (via a daily cron, self-gated to
        that interval) — pulls trending entertainment keywords and tags matching
        articles, without ever touching your headlines or written content.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Clock size={15} />
            <span className="text-xs font-semibold uppercase tracking-wide">Last Run</span>
          </div>
          <p className="text-sm font-medium text-slate-800">
            {lastRun?.run_at ? formatDateTime(lastRun.run_at) : "Never run yet"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Articles Updated (last run)
          </p>
          <p className="text-2xl font-bold text-slate-900">{lastRun?.articles_updated ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Next Automatic Run
          </p>
          <p className="text-sm font-medium text-slate-800">
            {nextRunIn === null
              ? "As soon as the cron next fires"
              : nextRunIn <= 0
              ? "Due now (waiting for next cron trigger)"
              : `In about ${nextRunIn.toFixed(1)}h`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles size={15} className="text-indigo-600" />
            Manual Run
          </h2>
          <RunAutomationButton />
        </div>
        <p className="text-xs text-slate-500">
          Forces a run right now, ignoring the 20-hour cooldown — useful for testing.
          Applies immediately with no review step.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Recently Cached Trending Keywords
        </h2>
        {keywords && keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((k, i) => (
              <span
                key={`${k.keyword}-${i}`}
                className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full"
              >
                {k.keyword} <span className="text-indigo-400">×{k.score}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No keywords cached yet — run the automation at least once.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h2 className="text-sm font-semibold text-slate-900 p-6 pb-4">Run History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-left">
              <th className="px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Run At</th>
              <th className="px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Articles Updated</th>
              <th className="px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Keywords Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentRuns && recentRuns.length > 0 ? (
              recentRuns.map((run) => (
                <tr key={run.id}>
                  <td className="px-6 py-3 text-slate-700">{formatDateTime(run.run_at)}</td>
                  <td className="px-6 py-3 text-slate-700">{run.articles_updated}</td>
                  <td className="px-6 py-3 text-slate-500 max-w-xs truncate">
                    {(run.keywords_used ?? []).join(", ") || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No runs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}