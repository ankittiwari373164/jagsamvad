"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TickerItem = { title: string; slug: string };

export default function BreakingNewsTicker({ items }: { items: TickerItem[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const goTo = (delta: number) =>
    setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <div className="bg-masthead text-paper">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-4 py-2">
        <span className="eyebrow text-[10px] font-bold bg-paper text-masthead px-2.5 py-1 shrink-0">
          Breaking
        </span>
        <div className="flex-1 min-w-0 overflow-hidden">
          <Link
            href={`/article/${items[index].slug}`}
            className="block text-sm truncate hover:underline"
          >
            {items[index].title}
          </Link>
        </div>
        {items.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              aria-label="Previous headline"
              onClick={() => goTo(-1)}
              className="p-1 hover:text-gold transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next headline"
              onClick={() => goTo(1)}
              className="p-1 hover:text-gold transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
