import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getPublishedArticles,
} from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/types";

export const revalidate = 60;

const PAGE_SIZE = 12;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  const title =
    currentPage > 1
      ? `${category.name} News, Reviews & Updates — Page ${currentPage}`
      : `${category.name} News, Reviews & Updates`;
  const description =
    category.description ||
    `Latest ${category.name} news, reviews and updates from Jagsamvad.`;
  const canonicalUrl =
    currentPage > 1
      ? `${SITE_URL}/category/${category.slug}?page=${currentPage}`
      : `${SITE_URL}/category/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl },
    // Page 1 is the canonical listing; later pages stay crawlable (so link
    // equity flows through to the articles) but are kept out of the index
    // to avoid thin/duplicate-content pages competing with page 1.
    robots:
      currentPage > 1
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getPublishedArticles({
    categorySlug: slug,
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="border-b hairline-strong pb-5 mb-8">
        <span className="eyebrow text-xs text-masthead font-bold">Desk</span>
        <h1 className="font-display text-4xl font-black mt-1">{category.name}</h1>
        {category.description && (
          <p className="text-ink-soft mt-2 max-w-2xl">{category.description}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <p className="text-ink-soft py-16 text-center">
          No stories published in this desk yet — check back soon.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} size="regular" />
            ))}
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t hairline">
            {currentPage > 1 ? (
              <Link
                href={`/category/${slug}?page=${currentPage - 1}`}
                className="eyebrow text-xs font-semibold border hairline-strong px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
              >
                ← Newer
              </Link>
            ) : (
              <span />
            )}
            {articles.length === PAGE_SIZE && (
              <Link
                href={`/category/${slug}?page=${currentPage + 1}`}
                className="eyebrow text-xs font-semibold border hairline-strong px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
              >
                Older →
              </Link>
            )}
          </div>
        </>
      )}

      <AdSlot />
    </div>
  );
}
