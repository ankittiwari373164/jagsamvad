"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="eyebrow text-[10px] font-bold border hairline-strong px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="eyebrow text-[10px] font-bold border hairline-strong px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors"
      >
        Share on X
      </a>
      <button
        onClick={copyLink}
        className="eyebrow text-[10px] font-bold border hairline-strong px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors flex items-center gap-1.5"
      >
        {copied ? <Check size={12} /> : <Share2 size={12} />}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}