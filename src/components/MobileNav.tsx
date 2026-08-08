"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import type { Category } from "@/lib/types";

export default function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="sm:hidden">
      {/* Top bar: menu | logo | search */}
      <div className="flex items-center justify-between px-3 h-14 border-b hairline-strong bg-paper">
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-2 -ml-2 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead rounded"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          जगसंवाद
        </Link>

        <button
          aria-label="Search"
          onClick={() => setSearchOpen((v) => !v)}
          className="p-2 -mr-2 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead rounded"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Optional inline search bar */}
      {searchOpen && (
        <div className="px-3 py-2 border-b hairline bg-paper">
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            className="w-full border hairline rounded px-3 py-2 text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Category strip */}
      <nav className="flex gap-5 overflow-x-auto px-3 py-2 border-b hairline bg-paper no-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="whitespace-nowrap eyebrow text-xs shrink-0"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* Slide-out drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setOpen(false)}>
          <nav
            className="absolute left-0 top-0 h-full w-72 bg-paper border-r hairline-strong p-5 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xl font-bold">जगसंवाद</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            <Link href="/" onClick={() => setOpen(false)} className="py-2.5 border-b hairline eyebrow text-xs">
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="py-2.5 border-b hairline eyebrow text-xs"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/about" onClick={() => setOpen(false)} className="py-2.5 border-b hairline eyebrow text-xs">
              About
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="py-2.5 border-b hairline eyebrow text-xs">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}