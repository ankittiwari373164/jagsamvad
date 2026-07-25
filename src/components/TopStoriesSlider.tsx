"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleWithRelations } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function TopStoriesSlider({ articles }: { articles: ArticleWithRelations[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (articles.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % articles.length), 5500);
    return () => clearInterval(id);
  }, [articles.length]);

  if (articles.length === 0) return null;
  const article = articles[index];
  const href = `/article/${article.slug}`;

  return (
    <section className="relative border hairline-strong overflow-hidden mb-10">
      <div className="relative aspect-[4/5] sm:aspect-[2.2/1]">
        {article.cover_image_url && (
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          {article.category && (
            <span className="eyebrow text-[10px] font-bold text-gold">{article.category.name}</span>
          )}
          <h2 className="font-display text-xl sm:text-3xl font-bold text-white leading-tight mt-1.5 mb-2 max-w-3xl">
            <Link href={href} className="hover:underline decoration-2 underline-offset-4">
              {article.title}
            </Link>
          </h2>
          <p className="eyebrow text-[10px] text-white/70">{formatDate(article.published_at)}</p>
        </div>
      </div>

      <span className="absolute top-4 left-4 eyebrow text-[10px] font-bold bg-masthead text-white px-3 py-1">
        Top Story
      </span>

      {articles.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
          {articles.map((a, i) => (
            <button
              key={a.id}
              aria-label={`Show top story ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}