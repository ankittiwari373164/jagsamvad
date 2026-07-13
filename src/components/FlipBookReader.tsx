"use client";

import { useMemo, useRef, useState, forwardRef } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

const CHARS_PER_PAGE = 950;

function paginate(html: string): string[] {
  if (typeof window === "undefined") return [html];
  const container = document.createElement("div");
  container.innerHTML = html;
  const nodes = Array.from(container.children);

  const pages: string[] = [];
  let current = "";
  let currentLen = 0;

  for (const node of nodes) {
    const chunk = node.outerHTML;
    const len = node.textContent?.length ?? 0;
    if (currentLen > 0 && currentLen + len > CHARS_PER_PAGE) {
      pages.push(current);
      current = "";
      currentLen = 0;
    }
    current += chunk;
    currentLen += len;
  }
  if (current) pages.push(current);
  return pages.length ? pages : [html];
}

const Page = forwardRef<HTMLDivElement, { html: string; pageNumber: number; title: string }>(
  function Page({ html, pageNumber, title }, ref) {
    return (
      <div
        ref={ref}
        className="bg-paper paper-texture border hairline-strong flex flex-col h-full"
      >
        <div className="flex items-center justify-between px-6 sm:px-10 pt-5 pb-3 border-b hairline">
          <span className="eyebrow text-[10px] text-masthead font-bold truncate pr-4">
            {title}
          </span>
          <span className="eyebrow text-[10px] text-ink-soft">Jagsamvad</span>
        </div>
        <div
          className="article-body flex-1 overflow-hidden px-6 sm:px-10 py-5 text-[0.95rem] sm:text-base leading-relaxed columns-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="eyebrow text-[10px] text-ink-soft text-center pb-4">
          — {pageNumber} —
        </div>
      </div>
    );
  }
);

export default function FlipBookReader({
  html,
  title,
}: {
  html: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const pages = useMemo(() => paginate(html), [html]);
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } } | null>(null);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border hairline-strong px-4 py-2 text-sm font-semibold eyebrow hover:bg-ink hover:text-paper transition-colors"
      >
        <BookOpen size={16} />
        Read in Print Edition
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/90 flex flex-col items-center justify-center p-3 sm:p-8">
          <button
            aria-label="Close print edition"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-paper hover:text-gold p-2"
          >
            <X size={26} />
          </button>

          <div className="w-full max-w-4xl h-[75vh] sm:h-[80vh] flex items-center justify-center gap-2">
            <button
              aria-label="Previous page"
              onClick={() => bookRef.current?.pageFlip().flipPrev()}
              className="hidden sm:flex text-paper hover:text-gold p-2 shrink-0"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="h-full w-full max-w-3xl">
              <HTMLFlipBook
                width={420}
                height={600}
                size="stretch"
                minWidth={280}
                maxWidth={600}
                minHeight={420}
                maxHeight={780}
                showCover={false}
                mobileScrollSupport
                className="mx-auto shadow-2xl"
                ref={bookRef}
              >
                {pages.map((pageHtml, i) => (
                  <Page key={i} html={pageHtml} pageNumber={i + 1} title={title} />
                ))}
              </HTMLFlipBook>
            </div>

            <button
              aria-label="Next page"
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className="hidden sm:flex text-paper hover:text-gold p-2 shrink-0"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <p className="eyebrow text-paper/60 text-[10px] mt-4 text-center">
            Tap or drag a corner to turn the page · {pages.length} pages
          </p>
        </div>
      )}
    </>
  );
}
