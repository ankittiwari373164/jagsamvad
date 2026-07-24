import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { fetchTrendingKeywords, type TrendingKeyword } from "@/lib/trending";
import { calculateSeoScore } from "@/lib/seo-score";
import { excerptFromHtml } from "@/lib/utils";

const MIN_HOURS_BETWEEN_RUNS = 20;
const MAX_TAGS_PER_ARTICLE = 8;
const ARTICLES_TO_SCAN = 60;

export type AutomationRunResult = {
  ran: boolean;
  reason?: string;
  articlesUpdated?: number;
  keywordsUsed?: string[];
};

/**
 * Applies trending keywords to recent published articles' tags (and fills
 * in a meta description if one is missing), then recomputes each
 * article's SEO score. Deliberately conservative about what it will ever
 * overwrite:
 *   - Never touches title, headline, or body content.
 *   - Never overwrites an existing meta_title/meta_description someone
 *     already wrote — only fills them in if empty.
 *   - Only appends new tags, never removes existing ones, and caps the
 *     total so tag lists don't grow unbounded over time.
 */
export async function runSeoAutomation(options?: { force?: boolean }): Promise<AutomationRunResult> {
  const supabase = createServiceRoleClient();

  if (!options?.force) {
    const { data: lastRun } = await supabase
      .from("seo_automation_runs")
      .select("run_at")
      .order("run_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastRun?.run_at) {
      const hoursSince = (Date.now() - new Date(lastRun.run_at).getTime()) / 36e5;
      if (hoursSince < MIN_HOURS_BETWEEN_RUNS) {
        return {
          ran: false,
          reason: `Last run was ${hoursSince.toFixed(1)}h ago — waiting until ${MIN_HOURS_BETWEEN_RUNS}h have passed.`,
        };
      }
    }
  }

  const trending = await fetchTrendingKeywords();

  if (trending.length > 0) {
    await supabase.from("trending_keywords").insert(
      trending.map((k) => ({ keyword: k.keyword, score: k.count, source: "google-news-rss" }))
    );
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, excerpt, content, tags, meta_title, meta_description, category_id, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(ARTICLES_TO_SCAN);

  let updatedCount = 0;
  const keywordsApplied = new Set<string>();

  for (const article of articles ?? []) {
    const matches = matchKeywords(article.title, trending);
    const newTags = Array.from(new Set([...(article.tags ?? []), ...matches])).slice(
      0,
      MAX_TAGS_PER_ARTICLE
    );
    const tagsChanged = newTags.length !== (article.tags?.length ?? 0);

    const metaDescription =
      article.meta_description || article.excerpt || excerptFromHtml(article.content || "");
    const metaChanged = !article.meta_description && !!metaDescription;

    if (!tagsChanged && !metaChanged) {
      continue;
    }

    const updatedArticle = {
      ...article,
      tags: newTags,
      meta_description: article.meta_description || metaDescription,
    };
    const { score } = calculateSeoScore(updatedArticle);

    const { error } = await supabase
      .from("articles")
      .update({
        tags: newTags,
        meta_description: updatedArticle.meta_description,
        seo_score: score,
        last_seo_update_at: new Date().toISOString(),
      })
      .eq("id", article.id);

    if (!error) {
      updatedCount += 1;
      matches.forEach((m) => keywordsApplied.add(m));
    }
  }

  await supabase.from("seo_automation_runs").insert({
    run_at: new Date().toISOString(),
    articles_updated: updatedCount,
    keywords_used: Array.from(keywordsApplied),
  });

  return {
    ran: true,
    articlesUpdated: updatedCount,
    keywordsUsed: Array.from(keywordsApplied),
  };
}

function matchKeywords(title: string, trending: TrendingKeyword[]): string[] {
  const titleLower = title.toLowerCase();
  return trending
    .filter((k) => titleLower.includes(k.keyword.toLowerCase()))
    .slice(0, 3)
    .map((k) => k.keyword.toLowerCase());
}