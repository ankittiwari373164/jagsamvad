"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X, RotateCcw, Trash2 } from "lucide-react";
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

const DRAFT_STORAGE_KEY = "jagsamvad_new_article_draft_v1";
const AUTOSAVE_DEBOUNCE_MS = 1500;

type DraftSnapshot = {
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  content: string;
  coverUrl: string;
  categoryId: string;
  authorId: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  status: "draft" | "published";
  isFeatured: boolean;
  savedAt: string;
};

function hasMeaningfulContent(snapshot: Pick<DraftSnapshot, "title" | "content">): boolean {
  const strippedContent = snapshot.content.replace(/<[^>]+>/g, "").trim();
  return snapshot.title.trim().length > 0 || strippedContent.length > 0;
}

export default function ArticleForm({ categories, authors, article, action, submitLabel }: Props) {
  const isCreate = !article;

  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!article);
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url ?? "");
  const [categoryId, setCategoryId] = useState(article?.category_id ?? "");
  const [authorId, setAuthorId] = useState(article?.author_id ?? "");
  const [tags, setTags] = useState(article?.tags?.join(", ") ?? "");
  const [metaTitle, setMetaTitle] = useState(article?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(article?.meta_description ?? "");
  const [status, setStatus] = useState<"draft" | "published">(article?.status ?? "draft");
  const [isFeatured, setIsFeatured] = useState(article?.is_featured ?? false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recoveredDraft, setRecoveredDraft] = useState<DraftSnapshot | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const recoveryResolvedRef = useRef(!isCreate); // edit mode never needs recovery

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

  // Check for a recoverable draft once, on mount, before anything else runs.
  useEffect(() => {
    if (!isCreate) return;
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed: DraftSnapshot = JSON.parse(raw);
        if (hasMeaningfulContent(parsed)) {
          // Reading localStorage must happen after mount (it doesn't exist
          // during SSR), so this one-time setState-on-mount is intentional.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setRecoveredDraft(parsed);
          return;
        }
      }
    } catch {
      // Corrupt or inaccessible storage — just proceed with a blank form.
    }
    recoveryResolvedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyRecoveredDraft = () => {
    if (!recoveredDraft) return;
    setTitle(recoveredDraft.title);
    setSlug(recoveredDraft.slug);
    setSlugTouched(recoveredDraft.slugTouched);
    setExcerpt(recoveredDraft.excerpt);
    setContent(recoveredDraft.content);
    setCoverUrl(recoveredDraft.coverUrl);
    setCategoryId(recoveredDraft.categoryId);
    setAuthorId(recoveredDraft.authorId);
    setTags(recoveredDraft.tags);
    setMetaTitle(recoveredDraft.metaTitle);
    setMetaDescription(recoveredDraft.metaDescription);
    setStatus(recoveredDraft.status);
    setIsFeatured(recoveredDraft.isFeatured);
    setRecoveredDraft(null);
    recoveryResolvedRef.current = true;
  };

  const discardRecoveredDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setRecoveredDraft(null);
    recoveryResolvedRef.current = true;
  };

  // Keep a ref mirroring current field values so the beforeunload/hide
  // handlers (which can't rely on the latest React state closures) always
  // flush the freshest data synchronously.
  const currentRef = useRef<DraftSnapshot | null>(null);
  useEffect(() => {
    currentRef.current = {
      title,
      slug,
      slugTouched,
      excerpt,
      content,
      coverUrl,
      categoryId,
      authorId,
      tags,
      metaTitle,
      metaDescription,
      status,
      isFeatured,
      savedAt: new Date().toISOString(),
    };
  }, [
    title,
    slug,
    slugTouched,
    excerpt,
    content,
    coverUrl,
    categoryId,
    authorId,
    tags,
    metaTitle,
    metaDescription,
    status,
    isFeatured,
  ]);

  const flushDraftToStorage = () => {
    if (!isCreate || !recoveryResolvedRef.current || !currentRef.current) return;
    if (!hasMeaningfulContent(currentRef.current)) return;
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(currentRef.current));
      setLastSavedAt(currentRef.current.savedAt);
    } catch {
      // Storage full/unavailable — nothing more we can do client-side.
    }
  };

  // Debounced autosave on every change.
  useEffect(() => {
    if (!isCreate || !recoveryResolvedRef.current) return;
    const timer = setTimeout(flushDraftToStorage, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    slug,
    excerpt,
    content,
    coverUrl,
    categoryId,
    authorId,
    tags,
    metaTitle,
    metaDescription,
    status,
    isFeatured,
  ]);

  // Immediate synchronous flush right before the tab closes/hides — this is
  // the part that actually protects against a sudden window close, since it
  // doesn't wait for the debounce timer and localStorage writes are
  // synchronous (no network round-trip to race against).
  useEffect(() => {
    if (!isCreate) return;
    const handleHide = () => flushDraftToStorage();
    const handleVisibility = () => {
      if (document.hidden) flushDraftToStorage();
    };
    window.addEventListener("beforeunload", handleHide);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("beforeunload", handleHide);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearDraftStorage = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <form
      action={formAction}
      onSubmit={() => {
        if (isCreate) clearDraftStorage();
      }}
      className="space-y-6 pb-16 max-w-3xl"
    >
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="cover_image_url" value={coverUrl} />

      {recoveredDraft && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              We found an unsaved draft from{" "}
              {new Date(recoveredDraft.savedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Looks like a previous session closed before this was saved. Restore it, or discard and start fresh.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={applyRecoveredDraft}
              className="flex items-center gap-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg px-3 py-2 hover:bg-amber-700 transition-colors"
            >
              <RotateCcw size={13} />
              Restore
            </button>
            <button
              type="button"
              onClick={discardRecoveredDraft}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-amber-300 text-amber-800 rounded-lg px-3 py-2 hover:bg-amber-100 transition-colors"
            >
              <Trash2 size={13} />
              Discard
            </button>
          </div>
        </div>
      )}

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
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
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
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
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
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
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
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
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
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
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

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending || uploading}
          className="text-sm font-semibold bg-indigo-600 text-white rounded-lg px-6 py-2.5 hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        {isCreate && lastSavedAt && (
          <p className="text-xs text-slate-400">
            Draft saved locally at{" "}
            {new Date(lastSavedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        )}
      </div>
    </form>
  );
}