import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ArticleCard";
import type { ArticleWithRelations } from "@/lib/types";
import { SITE_URL } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q || "").trim();
  return {
    title: query ? `Search: ${query}` : "Search",
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}/search` },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  let results: ArticleWithRelations[] = [];

  if (query.length >= 2) {
    const supabase = await createClient();
    const escaped = query.replace(/[%_]/g, (m) => `\\${m}`);
    const { data } = await supabase
      .from("articles")
      .select("*, category:categories(*), author:authors(*)")
      .eq("status", "published")
      .or(`title.ilike.%${escaped}%,excerpt.ilike.%${escaped}%,content.ilike.%${escaped}%`)
      .order("published_at", { ascending: false })
      .limit(30);
    results = (data ?? []) as unknown as ArticleWithRelations[];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <form action="/search" method="get" className="mb-10">
        <label htmlFor="search-input" className="eyebrow text-xs text-masthead font-bold block mb-2">
          Search Jagsamvad
        </label>
        <div className="flex gap-2 max-w-xl">
          <input
            id="search-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by title or keyword…"
            autoFocus
            className="flex-1 border hairline-strong px-4 py-3 text-lg font-display focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
          />
          <button
            type="submit"
            className="eyebrow text-xs font-bold bg-ink text-paper px-6 hover:bg-masthead transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {query.length > 0 && query.length < 2 ? (
        <p className="text-ink-soft">Type at least 2 characters to search.</p>
      ) : query.length === 0 ? (
        <p className="text-ink-soft">Enter a title or keyword above to search all articles.</p>
      ) : (
        <>
          <p className="eyebrow text-xs text-ink-soft mb-6">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>
          {results.length === 0 ? (
            <p className="text-ink-soft py-12 text-center">
              No stories matched your search. Try a different keyword.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {results.map((a) => (
                <ArticleCard key={a.id} article={a} size="regular" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}