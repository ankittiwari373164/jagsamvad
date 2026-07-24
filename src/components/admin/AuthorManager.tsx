"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  type AuthorFormState,
} from "@/app/actions/authors";
import type { Author } from "@/lib/types";

const initialState: AuthorFormState = { status: "idle" };
const inputClass =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white w-full";

function AuthorFormFields({
  author,
  action,
  submitLabel,
  onDone,
}: {
  author?: Author;
  action: (state: AuthorFormState, formData: FormData) => Promise<AuthorFormState>;
  submitLabel: string;
  onDone?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "success" && onDone) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="name" defaultValue={author?.name} placeholder="Full name" required className={inputClass} />
        <input name="slug" defaultValue={author?.slug} placeholder="slug (auto if blank)" className={inputClass} />
      </div>
      <textarea
        name="bio"
        defaultValue={author?.bio ?? ""}
        placeholder="Short bio"
        rows={2}
        className={inputClass}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="avatar_url"
          defaultValue={author?.avatar_url ?? ""}
          placeholder="Avatar image URL (optional)"
          className={inputClass}
        />
        <input
          name="twitter_url"
          defaultValue={author?.twitter_url ?? ""}
          placeholder="Twitter/X URL (optional)"
          className={inputClass}
        />
      </div>
      <input
        name="linkedin_url"
        defaultValue={author?.linkedin_url ?? ""}
        placeholder="LinkedIn URL (optional)"
        className={inputClass}
      />
      <button
        type="submit"
        disabled={pending}
        className="text-sm font-semibold bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
      {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}

export default function AuthorManager({ authors }: { authors: Author[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
          <Plus size={15} /> Add Author
        </h2>
        <AuthorFormFields action={createAuthor} submitLabel="Add" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {authors.map((a) =>
          editingId === a.id ? (
            <div key={a.id} className="p-4">
              <AuthorFormFields
                author={a}
                action={updateAuthor.bind(null, a.id)}
                submitLabel="Save"
                onDone={() => setEditingId(null)}
              />
              <button
                onClick={() => setEditingId(null)}
                className="text-xs text-slate-500 mt-2 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div key={a.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-sm text-slate-800">{a.name}</p>
                <p className="text-xs text-slate-400">/author/{a.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingId(a.id)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${a.name}"?`)) {
                      startTransition(() => deleteAuthor(a.id));
                    }
                  }}
                  disabled={isPending}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        )}
        {authors.length === 0 && (
          <p className="px-5 py-8 text-sm text-slate-500 text-center">No authors yet — add your first byline.</p>
        )}
      </div>
    </div>
  );
}