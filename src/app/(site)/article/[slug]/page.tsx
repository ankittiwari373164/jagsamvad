import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import FlipBookReader from "@/components/FlipBookReader";
import TableOfContents from "@/components/TableOfContents";
import AuthorCard from "@/components/AuthorCard";
import ShareButtons from "@/components/ShareButtons";
import { extractTocAndAddIds, splitAtTocMarker, prepareHtmlWithToc } from "@/lib/toc";
import { SITE_NAME, SITE_URL } from "@/lib/types";
import { formatDateTime, readingTime, excerptFromHtml } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "published") {
    return { title: "Story not found" };
  }

  const title = article.meta_title || article.title;
  const description =
    article.meta_description ||
    article.excerpt ||
    excerptFromHtml(article.content);
  const url = `${SITE_URL}/article/${article.slug}`;
  const shareImage = article.cover_image_url || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: shareImage }],
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at,
      authors: article.author ? [article.author.name] : undefined,
      section: article.category?.name,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  incrementArticleViews(article.id).catch(() => {});

  const related = await getRelatedArticles(article.category_id, article.id, 5);
  const url = `${SITE_URL}/article/${article.slug}`;
  const { html: contentHtml, toc } = extractTocAndAddIds(article.content);
  const tocSplit = splitAtTocMarker(contentHtml);
  const flipbookHtml = prepareHtmlWithToc(contentHtml, toc);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt || excerptFromHtml(article.content),
    image: [article.cover_image_url || `${SITE_URL}/og-image.png`],
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: [
      {
        "@type": "Person",
        name: article.author?.name ?? "Jagsamvad Desk",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      article.category && {
        "@type": "ListItem",
        position: 2,
        name: article.category.name,
        item: `${SITE_URL}/category/${article.category.slug}`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ].filter(Boolean),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <article className="lg:col-span-2 min-w-0">
          <nav className="eyebrow text-[11px] text-ink-soft mb-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {article.category && (
              <>
                {" "}
                /{" "}
                <Link href={`/category/${article.category.slug}`} className="hover:underline">
                  {article.category.name}
                </Link>
              </>
            )}
          </nav>

          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="eyebrow text-xs text-masthead font-bold hover:underline"
            >
              {article.category.name}
            </Link>
          )}

          <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight mt-3 mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-ink-soft leading-relaxed mb-5 font-body italic">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-y hairline-strong py-3 mb-6">
            <p className="eyebrow text-[11px] text-ink-soft">
              By{" "}
              {article.author ? (
                <Link href={`/author/${article.author.slug}`} className="text-ink font-bold hover:underline">
                  {article.author.name}
                </Link>
              ) : (
                <span className="text-ink font-bold">Jagsamvad Desk</span>
              )}{" "}
              · {formatDateTime(article.published_at)} · {readingTime(article.content)} min read
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <ShareButtons title={article.title} url={url} />
            <FlipBookReader html={flipbookHtml} title={article.title} />
          </div>

          {article.cover_image_url && (
            <div className="relative aspect-[16/9] mb-8 border hairline-strong">
              <Image
                src={article.cover_image_url}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {tocSplit ? (
            <>
              {tocSplit.before.trim() && (
                <div
                  className="article-body drop-cap"
                  dangerouslySetInnerHTML={{ __html: tocSplit.before }}
                />
              )}
              <TableOfContents items={toc} />
              {tocSplit.after.trim() && (
                <div
                  className={`article-body ${!tocSplit.before.trim() ? "drop-cap" : ""}`}
                  dangerouslySetInnerHTML={{ __html: tocSplit.after }}
                />
              )}
            </>
          ) : (
            <>
              <TableOfContents items={toc} />
              <div
                className="article-body drop-cap"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </>
          )}

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t hairline">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="eyebrow text-[10px] border hairline-strong px-2.5 py-1 text-ink-soft"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {article.author && <AuthorCard author={article.author} />}

          <AdSlot />

          {related.length > 0 && (
            <div className="border hairline-strong bg-white p-5">
              <p className="eyebrow text-[10px] text-masthead font-bold mb-4">
                More Like This
              </p>
              <div className="space-y-5">
                {related.map((a) => (
                  <ArticleCard key={a.id} article={a} size="compact" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}