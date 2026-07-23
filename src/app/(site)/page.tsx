import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import MarqueeTicker from "@/components/MarqueeTicker";
import EditorsPickCarousel from "@/components/EditorsPickCarousel";
import SidebarQuickLinks from "@/components/SidebarQuickLinks";
import NewsletterForm from "@/components/NewsletterForm";
import { formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE_NAME} — Bollywood, Hollywood, Korean Movies & OTT News`,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const articles = await getPublishedArticles({ limit: 20 });

  if (articles.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">
          The presses are warming up.
        </h1>
        <p className="text-ink-soft">
          No stories have been published yet. Once you publish your first
          article from the admin panel, it will appear right here on the
          front page.
        </p>
      </div>
    );
  }

  const ticker = articles.slice(0, 5).map((a) => ({ title: a.title, slug: a.slug }));
  const lead = articles[0];
  const trending = articles.slice(1, 5);
  const entertainment = articles.slice(5, 8);
  const editorsPick = articles.slice(8, 11);
  const latestNews = articles.slice(11, 15);

  return (
    <div>
      <h1 className="sr-only">
        {SITE_NAME} — Bollywood, Hollywood, Korean Movies &amp; OTT News
      </h1>
      <MarqueeTicker items={ticker} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* One continuous 2-column layout: left = Lead, Entertainment, Latest
            News stacked; right = Trending, Editor's Pick, Quick Links,
            Newsletter stacked. Both columns just grow with their own
            content — no forced row-by-row height matching between them. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">
            <ArticleCard article={lead} size="lead" />

            {entertainment.length > 0 && (
              <div className="pt-10 border-t hairline-strong">
                <div className="flex items-center justify-between border-b hairline-strong pb-2 mb-6">
                  <h2 className="font-display text-2xl font-bold">Entertainment</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8">
                  {entertainment.map((a) => (
                    <ArticleCard key={a.id} article={a} size="regular" />
                  ))}
                </div>
              </div>
            )}

            {latestNews.length > 0 && (
              <div className="pt-10 border-t hairline-strong">
                <div className="flex items-center justify-between border-b hairline-strong pb-2 mb-6">
                  <h2 className="font-display text-2xl font-bold">Latest News</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {latestNews.map((a) => (
                    <ArticleCard key={a.id} article={a} size="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <aside className="space-y-8">
            {trending.length > 0 && (
              <div>
                <h2 className="eyebrow text-xs text-masthead font-bold border-b hairline pb-2 mb-4">
                  Trending Now
                </h2>
                <ol className="space-y-4">
                  {trending.map((a, i) => (
                    <li key={a.id} className="flex items-start gap-3">
                      <span className="font-display text-2xl font-black text-masthead/70 leading-none w-6 shrink-0">
                        {i + 1}
                      </span>
                      {a.cover_image_url && (
                        <Link
                          href={`/article/${a.slug}`}
                          className="relative w-16 h-16 shrink-0 border hairline overflow-hidden"
                        >
                          <Image
                            src={a.cover_image_url}
                            alt={a.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </Link>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold leading-snug">
                          <Link href={`/article/${a.slug}`} className="hover:underline">
                            {a.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-ink-soft mt-1">{formatDate(a.published_at)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <EditorsPickCarousel articles={editorsPick} />
            <SidebarQuickLinks />
            <NewsletterForm />
          </aside>
        </div>
      </div>
    </div>
  );
}