"use client";

import { useActionState, useState } from "react";
import { MessageCircle } from "lucide-react";
import { submitComment, type CommentState } from "@/app/actions/comments";
import { formatDateTime } from "@/lib/utils";
import type { Comment } from "@/lib/data";

const initialState: CommentState = { status: "idle" };

export default function Comments({
  articleId,
  articleSlug,
  comments,
}: {
  articleId: string;
  articleSlug: string;
  comments: Comment[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitComment, initialState);

  return (
    <section className="mt-8 pt-6 border-t hairline-strong">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 eyebrow text-xs font-bold text-ink hover:text-masthead transition-colors"
      >
        <MessageCircle size={16} />
        {comments.length > 0
          ? `${comments.length} Comment${comments.length === 1 ? "" : "s"}`
          : "Comments"}
      </button>

      {open && (
        <div className="mt-5 space-y-6">
          {comments.length > 0 && (
            <ul className="space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="border hairline bg-paper-dim p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-display font-bold text-sm">{c.name}</p>
                    <p className="text-[11px] text-ink-soft">{formatDateTime(c.created_at)}</p>
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">{c.body}</p>
                </li>
              ))}
            </ul>
          )}

          <form action={formAction} className="border hairline-strong bg-white p-5 space-y-3">
            <input type="hidden" name="article_id" value={articleId} />
            <input type="hidden" name="article_slug" value={articleSlug} />
            <p className="eyebrow text-xs text-masthead font-bold">Leave a Comment</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="name"
                placeholder="Name"
                required
                className="border hairline-strong bg-paper px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
              />
              <input
                name="email"
                type="email"
                placeholder="Email (not published)"
                required
                className="border hairline-strong bg-paper px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
              />
            </div>
            <textarea
              name="body"
              rows={4}
              required
              maxLength={2000}
              placeholder="Write your comment…"
              className="w-full border hairline-strong bg-paper px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
            />
            <button
              type="submit"
              disabled={pending}
              className="eyebrow text-xs font-bold bg-ink text-paper px-5 py-2.5 hover:bg-masthead transition-colors disabled:opacity-60"
            >
              {pending ? "Posting…" : "Post Comment"}
            </button>
            {state.status !== "idle" && (
              <p className={`text-xs ${state.status === "success" ? "text-green-800" : "text-masthead"}`}>
                {state.message}
              </p>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
