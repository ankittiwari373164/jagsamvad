import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { PenSquare, FileText, CheckCircle2, FileClock, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: total }, { count: published }, { count: drafts }, { data: recent }] =
    await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase
        .from("articles")
        .select("id, title, slug, status, updated_at")
        .order("updated_at", { ascending: false })
        .limit(6),
    ]);

  const stats = [
    { label: "Total Stories", value: total ?? 0, icon: FileText, color: "bg-indigo-50 text-indigo-600" },
    { label: "Published", value: published ?? 0, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { label: "Drafts", value: drafts ?? 0, icon: FileClock, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back to the Jagsamvad newsroom.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <PenSquare size={16} />
          New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${s.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900">Recently Updated</h2>
        <Link
          href="/admin/articles"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {recent && recent.length > 0 ? (
          recent.map((a) => (
            <Link
              key={a.id}
              href={`/admin/articles/${a.id}/edit`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-800 truncate pr-4">{a.title}</span>
              <span className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    a.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {a.status}
                </span>
                <span className="text-xs text-slate-400 w-32 text-right">{formatDateTime(a.updated_at)}</span>
              </span>
            </Link>
          ))
        ) : (
          <p className="px-5 py-8 text-sm text-slate-500 text-center">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
