import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { PenSquare, Eye } from "lucide-react";
import ArticleRowActions from "@/components/admin/ArticleRowActions";

function seoScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-50 text-emerald-700";
  if (score >= 50) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select(
      "id, title, slug, status, published_at, updated_at, views, seo_score, category:categories(name)"
    )
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage every story in the newsroom.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <PenSquare size={16} />
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-slate-200 text-left bg-slate-50">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Views</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">SEO</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Updated</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles && articles.length > 0 ? (
              articles.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800 max-w-xs truncate">{a.title}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {(a.category as unknown as { name: string } | null)?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        a.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Eye size={13} className="text-slate-400" />
                      {(a.views ?? 0).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${seoScoreColor(a.seo_score ?? 0)}`}>
                      {a.seo_score ?? 0}/100
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDate(a.updated_at)}</td>
                  <td className="px-5 py-3.5">
                    <ArticleRowActions id={a.id} slug={a.slug} status={a.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                  No articles yet — create your first story.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}