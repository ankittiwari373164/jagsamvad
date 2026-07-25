"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleWithRelations } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";

export default function EditorsPickCarousel({
  articles,
}: {
  articles: ArticleWithRelations[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (articles.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % articles.length), 6000);
    return () => clearInterval(id);
  }, [articles.length]);

  if (articles.length === 0) return null;
  const article = articles[index];
  const href = `/article/${article.slug}`;

  return (
    <div>
      <article className="flex flex-col sm:flex-row gap-6">
        {article.cover_image_url && (
          <Link
            href={href}
            className="relative w-full sm:w-2/5 aspect-[16/10] shrink-0 border hairline-strong overflow-hidden"
          >
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              className="object-cover"
            />
          </Link>
        )}
        <div className="min-w-0">
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="eyebrow text-xs text-masthead font-bold hover:underline"
            >
              {article.category.name}
            </Link>
          )}
          <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug mt-1.5 mb-2">
            <Link href={href} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          {article.excerpt && (
            <p className="text-sm text-ink-soft leading-relaxed mb-3 line-clamp-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <Link href={href} className="text-sm font-semibold text-masthead hover:underline">
              Read More →
            </Link>
            <p className="eyebrow text-[10px] text-ink-soft whitespace-nowrap">
              {formatDate(article.published_at)} · {readingTime(article.content)} min read
            </p>
          </div>
        </div>
      </article>

      {articles.length > 1 && (
        <div className="flex items-center gap-2 mt-5">
          {articles.map((a, i) => (
            <button
              key={a.id}
              aria-label={`Show pick ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-masthead" : "bg-ink/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}