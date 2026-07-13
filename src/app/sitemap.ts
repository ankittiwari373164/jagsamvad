import type { MetadataRoute } from "next";
import { getCategories, getPublishedArticles } from "@/lib/data";
import { SITE_URL } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, articles] = await Promise.all([
    getCategories(),
    getPublishedArticles({ limit: 1000 }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/editorial-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/article/${a.slug}`,
    lastModified: a.updated_at,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
