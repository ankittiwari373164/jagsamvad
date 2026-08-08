"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Category } from "@/lib/types";

export default function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="p-2 -ml-2 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead rounded"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setOpen(false)}>
          <nav
            className="absolute left-0 top-0 h-full w-72 bg-paper border-r hairline-strong p-5 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end mb-4">
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