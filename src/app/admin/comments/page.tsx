import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { approveComment, rejectComment, deleteComment } from "@/app/actions/comments";
import { Check, X, Trash2 } from "lucide-react";
import type { Comment } from "@/lib/data";

type CommentRow = Comment & { article: { title: string; slug: string } | null };

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*, article:articles(title, slug)")
    .order("created_at", { ascending: false });

  const rows = (comments ?? []) as unknown as CommentRow[];
  const pending = rows.filter((c) => !c.is_approved);
  const approved = rows.filter((c) => c.is_approved);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Comments</h1>
      <p className="text-sm text-slate-500 mb-8">
        Moderate reader comments before they appear on articles.
      </p>

      <Section title={`Pending Approval (${pending.length})`} rows={pending} showApprove />
      <Section title={`Approved (${approved.length})`} rows={approved} showApprove={false} />
    </div>
  );
}

function Section({
  title,
  rows,
  showApprove,
}: {
  title: string;
  rows: CommentRow[];
  showApprove: boolean;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">{title}</h2>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-500 text-center">Nothing here.</p>
        ) : (
          rows.map((c) => (
            <div key={c.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {c.name} <span className="text-slate-400 font-normal">· {c.email}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    On <span className="font-medium">{c.article?.title ?? "Unknown article"}</span> ·{" "}
                    {formatDateTime(c.created_at)}
                  </p>
                  <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{c.body}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {showApprove && (
                    <form action={approveComment.bind(null, c.id)}>
                      <button className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100" aria-label="Approve">
                        <Check size={15} />
                      </button>
                    </form>
                  )}
                  {!showApprove && (
                    <form action={rejectComment.bind(null, c.id)}>
                      <button className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100" aria-label="Unapprove">
                        <X size={15} />
                      </button>
                    </form>
                  )}
                  <form action={deleteComment.bind(null, c.id)}>
                    <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
