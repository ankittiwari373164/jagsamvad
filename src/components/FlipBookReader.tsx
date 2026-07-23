"use client";

import { useMemo, useRef, useState, forwardRef } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

// Kept deliberately small so a page's content always fits without needing
// to scroll inside it — more, shorter pages beats a few pages you have to
// scroll through.
const CHARS_PER_PAGE = 480;

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

const Page = forwardRef<
  HTMLDivElement,
  { html: string; pageNumber: number; totalPages: number; title: string; edge: "left" | "right" }
>(function Page({ html, pageNumber, totalPages, title, edge }, ref) {
  return (
    <div
      ref={ref}
      className="relative bg-paper paper-texture flex flex-col h-full overflow-hidden"
    >
      {/* Book-spine shadow, closest to the fold */}
      <div
        className={`pointer-events-none absolute inset-y-0 w-10 z-10 ${
          edge === "right"
            ? "left-0 bg-gradient-to-r from-black/15 to-transparent"
            : "right-0 bg-gradient-to-l from-black/15 to-transparent"
        }`}
      />
      <div className="flex items-center justify-between px-5 sm:px-8 pt-4 pb-2.5 border-b hairline">
        <span className="eyebrow text-[9px] text-masthead font-bold truncate pr-4">
          {title}
        </span>
        <span className="eyebrow text-[9px] text-ink-soft shrink-0">Jagsamvad</span>
      </div>
      <div
        className="article-body flex-1 overflow-hidden px-5 sm:px-8 py-4 text-[0.85rem] sm:text-[0.92rem] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="eyebrow text-[9px] text-ink-soft text-center pb-3 pt-1 border-t hairline">
        Page {pageNumber} of {totalPages}
      </div>
    </div>
  );
});

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
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-ink to-[#100f0d] flex flex-col items-center justify-center p-3 sm:p-8">
          <button
            aria-label="Close print edition"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-paper hover:text-gold bg-white/10 hover:bg-white/15 rounded-full p-2 transition-colors"
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-4xl h-[78vh] sm:h-[82vh] flex items-center justify-center gap-2">
            <button
              aria-label="Previous page"
              onClick={() => bookRef.current?.pageFlip().flipPrev()}
              className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-paper transition-colors shrink-0"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="h-full w-full max-w-3xl">
              <HTMLFlipBook
                width={420}
                height={640}
                size="stretch"
                minWidth={280}
                maxWidth={600}
                minHeight={440}
                maxHeight={820}
                showCover={false}
                mobileScrollSupport={false}
                className="mx-auto shadow-2xl rounded-sm overflow-hidden"
                ref={bookRef}
              >
                {pages.map((pageHtml, i) => (
                  <Page
                    key={i}
                    html={pageHtml}
                    pageNumber={i + 1}
                    totalPages={pages.length}
                    title={title}
                    edge={i % 2 === 0 ? "right" : "left"}
                  />
                ))}
              </HTMLFlipBook>
            </div>

            <button
              aria-label="Next page"
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-paper transition-colors shrink-0"
            >
              <ChevronRight size={24} />
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