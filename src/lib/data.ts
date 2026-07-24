import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ArticleWithRelations, Category } from "@/lib/types";

const ARTICLE_SELECT = `
  *,
  category:categories(*),
  author:authors(*)
`;

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("created_at");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getPublishedArticles(options?: {
  categorySlug?: string;
  limit?: number;
  offset?: number;
  featuredOnly?: boolean;
}): Promise<ArticleWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.categorySlug) {
    const category = await getCategoryBySlug(options.categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options?.limit) {
    const from = options.offset ?? 0;
    query = query.range(from, from + options.limit - 1);
  }

  const { data } = await query;
  return (data ?? []) as unknown as ArticleWithRelations[];
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithRelations | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  return data as unknown as ArticleWithRelations | null;
}

export async function getRelatedArticles(
  categoryId: string | null,
  excludeId: string,
  limit = 4
): Promise<ArticleWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data } = await query;
  return (data ?? []) as unknown as ArticleWithRelations[];
}

export async function getMostViewedArticles(limit = 5): Promise<ArticleWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .order("views", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as ArticleWithRelations[];
}

export async function getAuthorBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function incrementArticleViews(id: string) {
  const supabase = await createClient();
  try {
    await supabase.rpc("increment_article_views", { article_id: id });
  } catch {
    // Non-critical — view counts simply won't tick up if the RPC is missing.
  }
}