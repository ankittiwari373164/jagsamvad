import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorBySlug } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ArticleCard";
import type { ArticleWithRelations } from "@/lib/types";
import { SITE_URL } from "@/lib/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Author not found" };

  return {
    title: `${author.name} — Author at Jagsamvad`,
    description: author.bio || `Articles written by ${author.name} on Jagsamvad.`,
    alternates: { canonical: `${SITE_URL}/author/${author.slug}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*, category:categories(*), author:authors(*)")
    .eq("author_id", author.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio ?? undefined,
    url: `${SITE_URL}/author/${author.slug}`,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b hairline-strong pb-8 mb-10">
        {author.avatar_url ? (
          <div className="relative w-24 h-24 shrink-0 border hairline-strong overflow-hidden">
            <Image src={author.avatar_url} alt={author.name} fill sizes="96px" className="object-cover" />
          </div>
        ) : (
          <div className="w-24 h-24 shrink-0 border hairline-strong bg-ink text-paper flex items-center justify-center font-display text-3xl font-bold">
            {author.name.charAt(0)}
          </div>
        )}
        <div>
          <span className="eyebrow text-xs text-masthead font-bold">Author</span>
          <h1 className="font-display text-3xl font-black mt-1">{author.name}</h1>
          {author.bio && <p className="text-ink-soft mt-2 max-w-2xl">{author.bio}</p>}
        </div>
      </header>

      {!articles || articles.length === 0 ? (
        <p className="text-ink-soft py-16 text-center">No published stories yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {(articles as unknown as ArticleWithRelations[]).map((a) => (
            <ArticleCard key={a.id} article={a} size="regular" />
          ))}
        </div>
      )}
    </div>
  );
}
