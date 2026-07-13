"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleWithRelations } from "@/lib/types";

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
      <h2 className="eyebrow text-xs text-masthead font-bold border-b hairline pb-2 mb-4">
        Editor&rsquo;s Pick
      </h2>
      <article>
        {article.cover_image_url && (
          <Link href={href} className="block relative aspect-[4/3] border hairline-strong overflow-hidden mb-3">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="320px"
              className="object-cover"
            />
          </Link>
        )}
        <h3 className="font-display text-lg font-bold leading-snug mb-2">
          <Link href={href} className="hover:underline">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && (
          <p className="text-sm text-ink-soft leading-relaxed mb-2 line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <Link href={href} className="text-sm font-semibold text-masthead hover:underline">
          Read More →
        </Link>
      </article>

      {articles.length > 1 && (
        <div className="flex items-center gap-2 mt-4">
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
