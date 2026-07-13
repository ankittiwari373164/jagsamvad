"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Article, Author, Category } from "@/lib/types";
import type { ArticleFormState } from "@/app/actions/articles";

type Props = {
  categories: Category[];
  authors: Author[];
  article?: Article;
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  submitLabel: string;
};

const initialState: ArticleFormState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white";
const labelClass = "text-sm font-medium text-slate-700 block mb-1.5";

export default function ArticleForm({ categories, authors, article, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!article);
  const [content, setContent] = useState(article?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleCoverUpload = async (file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("article-images").upload(path, file);
      if (error) {
        alert(`Upload failed: ${error.message}`);
        return;
      }
      const { data } = supabase.storage.from("article-images").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6 pb-16 max-w-3xl">
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="cover_image_url" value={coverUrl} />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label htmlFor="title" className={labelClass}>
            Headline
          </label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={`${inputClass} text-lg font-semibold`}
            placeholder="A compelling headline"
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            URL Slug
          </label>
          <div className="flex items-center rounded-lg border border-slate-300 px-3.5 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <span className="text-slate-400 text-sm shrink-0">/article/</span>
            <input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="flex-1 py-2.5 pl-1 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>
            Excerpt / Standfirst
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={article?.excerpt ?? ""}
            className={inputClass}
            placeholder="One or two sentences summarising the story"
          />
        </div>

        <div>
          <span className={labelClass}>Cover Image</span>
          {coverUrl ? (
            <div className="relative w-full max-w-md aspect-[16/9] rounded-lg overflow-hidden border border-slate-200">
              <Image src={coverUrl} alt="Cover" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setCoverUrl("")}
                className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors"
                aria-label="Remove cover image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading…" : "Upload cover image"}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category_id" className={labelClass}>
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={article?.category_id ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author_id" className={labelClass}>
              Author
            </label>
            <select
              id="author_id"
              name="author_id"
              defaultValue={article?.author_id ?? ""}
              className={inputClass}
            >
              <option value="">Jagsamvad Desk (no byline)</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className={labelClass}>
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={article?.tags?.join(", ") ?? ""}
            className={inputClass}
            placeholder="e.g. netflix, thriller, release-date"
          />
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-slate-700 block mb-1.5">Story</span>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">SEO &amp; Metadata</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="meta_title" className={labelClass}>
              Meta Title <span className="text-slate-400 font-normal">(optional — falls back to headline)</span>
            </label>
            <input
              id="meta_title"
              name="meta_title"
              defaultValue={article?.meta_title ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="meta_description" className={labelClass}>
              Meta Description <span className="text-slate-400 font-normal">(optional — falls back to excerpt)</span>
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              rows={2}
              defaultValue={article?.meta_description ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-wrap items-center gap-6">
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={article?.status ?? "draft"}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 mt-5">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={article?.is_featured}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Feature this story on the front page
        </label>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || uploading}
        className="text-sm font-semibold bg-indigo-600 text-white rounded-lg px-6 py-2.5 hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
