"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { deleteArticle, toggleArticleStatus } from "@/app/actions/articles";

export default function ArticleRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: "draft" | "published";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-1">
      {status === "published" && (
        <Link
          href={`/article/${slug}`}
          target="_blank"
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="View live"
          title="View live"
        >
          <Eye size={16} />
        </Link>
      )}
      <button
        onClick={() =>
          startTransition(() => toggleArticleStatus(id, status === "published" ? "draft" : "published"))
        }
        disabled={isPending}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
        aria-label={status === "published" ? "Unpublish" : "Publish"}
        title={status === "published" ? "Move to draft" : "Publish"}
      >
        {status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <Link
        href={`/admin/articles/${id}/edit`}
        className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        aria-label="Edit"
        title="Edit"
      >
        <Pencil size={16} />
      </Link>
      <button
        onClick={() => {
          if (confirm("Delete this article permanently?")) {
            startTransition(() => deleteArticle(id));
          }
        }}
        disabled={isPending}
        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
        aria-label="Delete"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
