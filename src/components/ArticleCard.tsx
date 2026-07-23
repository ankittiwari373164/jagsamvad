import Link from "next/link";
import Image from "next/image";
import type { ArticleWithRelations } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";

export default function ArticleCard({
  article,
  size = "regular",
}: {
  article: ArticleWithRelations;
  size?: "lead" | "regular" | "horizontal" | "compact";
}) {
  const href = `/article/${article.slug}`;

  if (size === "lead") {
    return (
      <article className="group">
        {article.cover_image_url && (
          <Link href={href} className="block relative aspect-[16/9] overflow-hidden border hairline-strong mb-4">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
              priority
            />
          </Link>
        )}
        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="eyebrow text-xs text-masthead font-bold hover:underline"
          >
            {article.category.name}
          </Link>
        )}
        <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight mt-2 mb-3">
          <Link href={href} className="hover:underline decoration-2 underline-offset-4">
            {article.title}
          </Link>
        </h2>
        {article.excerpt && (
          <p className="text-ink-soft leading-relaxed mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between gap-3">
          <Link href={href} className="text-sm font-semibold text-masthead hover:underline">
            Read More →
          </Link>
          <p className="eyebrow text-[11px] text-ink-soft whitespace-nowrap">
            {formatDate(article.published_at)} · {readingTime(article.content)} min read
          </p>
        </div>
      </article>
    );
  }

  if (size === "compact") {
    return (
      <article className="flex gap-3 items-start">
        {article.cover_image_url && (
          <Link href={href} className="relative w-20 h-20 shrink-0 border hairline overflow-hidden">
            <Image src={article.cover_image_url} alt={article.title} fill sizes="80px" className="object-cover" />
          </Link>
        )}
        <div className="min-w-0">
          {article.category && (
            <span className="eyebrow text-[10px] text-masthead font-bold">{article.category.name}</span>
          )}
          <h3 className="font-display text-base font-bold leading-snug mt-0.5">
            <Link href={href} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          <p className="text-xs text-ink-soft mt-1">{formatDate(article.published_at)}</p>
        </div>
      </article>
    );
  }

  if (size === "horizontal") {
    return (
      <article className="flex gap-4">
        {article.cover_image_url && (
          <Link href={href} className="relative w-28 h-24 sm:w-32 sm:h-28 shrink-0 border hairline overflow-hidden">
            <Image src={article.cover_image_url} alt={article.title} fill sizes="128px" className="object-cover" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="eyebrow text-[10px] text-masthead font-bold hover:underline"
            >
              {article.category.name}
            </Link>
          )}
          <h3 className="font-display text-base sm:text-lg font-bold leading-snug mt-1 mb-1.5">
            <Link href={href} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          {article.excerpt && (
            <p className="text-sm text-ink-soft leading-relaxed line-clamp-2 mb-1.5">{article.excerpt}</p>
          )}
          <p className="eyebrow text-[10px] text-ink-soft">
            {formatDate(article.published_at)} · {readingTime(article.content)} min read
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="border-b hairline pb-6">
      {article.cover_image_url && (
        <Link href={href} className="block relative aspect-[16/10] overflow-hidden border hairline mb-3">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-300"
          />
        </Link>
      )}
      {article.category && (
        <Link
          href={`/category/${article.category.slug}`}
          className="eyebrow text-[11px] text-masthead font-bold hover:underline"
        >
          {article.category.name}
        </Link>
      )}
      <h3 className="font-display text-xl font-bold leading-snug mt-1.5 mb-2">
        <Link href={href} className="hover:underline decoration-2 underline-offset-4">
          {article.title}
        </Link>
      </h3>
      {article.excerpt && (
        <p className="text-sm text-ink-soft leading-relaxed line-clamp-3 mb-2">{article.excerpt}</p>
      )}
      <div className="flex items-center justify-between gap-3">
        <Link href={href} className="text-sm font-semibold text-masthead hover:underline">
          Read More →
        </Link>
        <p className="eyebrow text-[10px] text-ink-soft whitespace-nowrap">
          {formatDate(article.published_at)} · {readingTime(article.content)} min read
        </p>
      </div>
    </article>
  );
}