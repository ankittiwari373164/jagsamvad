"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryFormState,
} from "@/app/actions/categories";
import type { Category } from "@/lib/types";

const initialState: CategoryFormState = { status: "idle" };
const inputClass =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white w-full";

function CategoryFormFields({
  category,
  action,
  submitLabel,
  onDone,
}: {
  category?: Category;
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  submitLabel: string;
  onDone?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "success" && onDone) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr_auto] gap-3 items-start">
      <input name="name" defaultValue={category?.name} placeholder="Name" required className={inputClass} />
      <input name="slug" defaultValue={category?.slug} placeholder="slug (auto if blank)" className={inputClass} />
      <input
        name="description"
        defaultValue={category?.description ?? ""}
        placeholder="Description (optional)"
        className={inputClass}
      />
      <button
        type="submit"
        disabled={pending}
        className="text-sm font-semibold bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
      {state.status === "error" && (
        <p className="sm:col-span-4 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
          <Plus size={15} /> Add Category
        </h2>
        <CategoryFormFields action={createCategory} submitLabel="Add" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {categories.map((c) =>
          editingId === c.id ? (
            <div key={c.id} className="p-4">
              <CategoryFormFields
                category={c}
                action={updateCategory.bind(null, c.id)}
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
            <div key={c.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-sm text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">/category/{c.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingId(c.id)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${c.name}"? Articles in this category will become uncategorized.`)) {
                      startTransition(() => deleteCategory(c.id));
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
      </div>
    </div>
  );
}
