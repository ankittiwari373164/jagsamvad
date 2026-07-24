"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { calculateSeoScore } from "@/lib/seo-score";

export type ArticleFormState = { status: "idle" | "error"; message?: string };

function extractPayload(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const tagsRaw = String(formData.get("tags") || "").trim();

  return {
    title,
    slug: slugify(slugInput || title),
    excerpt: String(formData.get("excerpt") || "").trim() || null,
    content: String(formData.get("content") || ""),
    cover_image_url: String(formData.get("cover_image_url") || "").trim() || null,
    category_id: String(formData.get("category_id") || "").trim() || null,
    author_id: String(formData.get("author_id") || "").trim() || null,
    status: String(formData.get("status") || "draft") as "draft" | "published",
    is_featured: formData.get("is_featured") === "on",
    meta_title: String(formData.get("meta_title") || "").trim() || null,
    meta_description: String(formData.get("meta_description") || "").trim() || null,
    tags: tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  };
}

export async function createArticle(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const payload = extractPayload(formData);
  if (!payload.title) return { status: "error", message: "Title is required." };

  const supabase = await createClient();
  const publishing = payload.status === "published";
  const { score } = calculateSeoScore(payload);

  const { error } = await supabase.from("articles").insert({
    ...payload,
    seo_score: score,
    published_at: publishing ? new Date().toISOString() : null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(
  id: string,
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const payload = extractPayload(formData);
  if (!payload.title) return { status: "error", message: "Title is required." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("articles")
    .select("status, published_at")
    .eq("id", id)
    .maybeSingle();

  const publishing = payload.status === "published";
  const wasPublished = existing?.status === "published";
  const { score } = calculateSeoScore(payload);

  const { error } = await supabase
    .from("articles")
    .update({
      ...payload,
      seo_score: score,
      published_at: publishing
        ? existing?.published_at && wasPublished
          ? existing.published_at
          : new Date().toISOString()
        : null,
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/articles");
  revalidatePath(`/article/${payload.slug}`);
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/admin/articles");
  revalidatePath("/");
}

export async function toggleArticleStatus(id: string, newStatus: "draft" | "published") {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("articles")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  await supabase
    .from("articles")
    .update({
      status: newStatus,
      published_at:
        newStatus === "published" ? existing?.published_at ?? new Date().toISOString() : null,
    })
    .eq("id", id);

  revalidatePath("/admin/articles");
  revalidatePath("/");
}