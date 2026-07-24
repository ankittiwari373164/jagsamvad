import type { Article } from "@/lib/types";

export type SeoCheck = { label: string; passed: boolean; points: number };

export type SeoScoreResult = {
  score: number; // 0-100
  checks: SeoCheck[];
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Scores an article against a fixed checklist of well-known on-page SEO
 * factors. Deterministic and side-effect free — safe to call from a
 * server action on every save, or from the automation cron job.
 */
export function calculateSeoScore(
  article: Pick<
    Article,
    | "title"
    | "excerpt"
    | "content"
    | "meta_title"
    | "meta_description"
    | "tags"
    | "category_id"
    | "cover_image_url"
  >
): SeoScoreResult {
  const plainContent = stripHtml(article.content || "");
  const words = wordCount(plainContent);
  const titleLen = article.title?.length ?? 0;
  const metaDescLen = (article.meta_title ? article.meta_title : article.title)?.length ?? 0;
  const descLen = (article.meta_description || article.excerpt || "").length;
  const hasH2 = /<h2[\s>]/i.test(article.content || "");
  const hasImageWithAlt = /<img[^>]*alt="[^"]+"[^>]*>/i.test(article.content || "");
  const hasAnyImage = /<img[\s>]/i.test(article.content || "") || !!article.cover_image_url;

  const checks: SeoCheck[] = [
    {
      label: "Title length (30–65 characters)",
      passed: titleLen >= 30 && titleLen <= 65,
      points: 15,
    },
    {
      label: "Meta title reasonable length",
      passed: metaDescLen > 0 && metaDescLen <= 70,
      points: 10,
    },
    {
      label: "Meta/excerpt description present (70–160 characters)",
      passed: descLen >= 70 && descLen <= 160,
      points: 15,
    },
    {
      label: "Content length (300+ words)",
      passed: words >= 300,
      points: 20,
    },
    {
      label: "Has at least one subheading (H2)",
      passed: hasH2,
      points: 10,
    },
    {
      label: "Has a cover image or in-body image",
      passed: hasAnyImage,
      points: 10,
    },
    {
      label: "In-body images have alt text",
      passed: hasImageWithAlt || !/<img[\s>]/i.test(article.content || ""),
      points: 5,
    },
    {
      label: "Has at least 3 tags",
      passed: (article.tags?.length ?? 0) >= 3,
      points: 10,
    },
    {
      label: "Assigned to a category",
      passed: !!article.category_id,
      points: 5,
    },
  ];

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0);

  return { score, checks };
}