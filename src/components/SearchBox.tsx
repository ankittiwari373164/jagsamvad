"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBox({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [open, setOpen] = useState(variant === "mobile");
  const [value, setValue] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    if (variant === "desktop") setOpen(false);
  };

  if (variant === "desktop" && !open) {
    return (
      <button
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="text-paper hover:text-gold transition-colors p-2 -mr-2 shrink-0"
      >
        <Search size={16} />
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-1.5">
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search articles…"
          autoFocus={variant === "desktop"}
          className={`pl-8 pr-2 py-1.5 text-sm border hairline-strong bg-white text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead ${
            variant === "desktop" ? "w-48" : "w-full"
          }`}
        />
      </div>
      {variant === "desktop" && (
        <button
          type="button"
          aria-label="Close search"
          onClick={() => {
            setOpen(false);
            setValue("");
          }}
          className="text-paper hover:text-gold transition-colors p-1"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}