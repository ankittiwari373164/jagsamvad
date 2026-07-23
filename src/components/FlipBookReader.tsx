"use client";

import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

const CONTENT_HORIZONTAL_PADDING = 64; // px-8 on both sides of each page
const CHROME_HEIGHT = 64; // measured header + footer strip height on each page
const SAFETY_MARGIN = 24;

function serialize(elements: Element[]): string {
  return elements.map((el) => el.outerHTML).join("");
}

/**
 * Paginates by actually rendering candidate content into a hidden,
 * identically-styled measuring element sized to the *real* page dimensions
 * (passed in, not guessed) and checking its real height. Because the book
 * is later rendered at these exact same dimensions, nothing can ever be
 * clipped or wildly under-filled.
 */
function paginate(html: string, pageWidth: number, pageHeight: number): string[] {
  if (typeof window === "undefined") return [html];

  const contentWidth = pageWidth - CONTENT_HORIZONTAL_PADDING;
  const contentHeight = pageHeight - CHROME_HEIGHT - SAFETY_MARGIN;

  const measurer = document.createElement("div");
  measurer.className = "article-body";
  Object.assign(measurer.style, {
    position: "fixed",
    visibility: "hidden",
    pointerEvents: "none",
    top: "-9999px",
    left: "-9999px",
    width: `${contentWidth}px`,
    fontSize: "0.92rem",
  });
  document.body.appendChild(measurer);

  const measure = (elements: Element[]) => {
    measurer.innerHTML = serialize(elements);
    return measurer.scrollHeight;
  };

  const source = document.createElement("div");
  source.innerHTML = html;
  const nodes = Array.from(source.children);

  const pages: string[] = [];
  let current: Element[] = [];

  for (const node of nodes) {
    const trial = [...current, node];
    if (current.length > 0 && measure(trial) > contentHeight) {
      pages.push(serialize(current));
      current = [node];
    } else {
      current = trial;
    }
    if (current.length === 1 && measure(current) > contentHeight) {
      pages.push(serialize(current));
      current = [];
    }
  }
  if (current.length > 0) pages.push(serialize(current));

  document.body.removeChild(measurer);
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
        className="article-body flex-1 overflow-hidden px-5 sm:px-8 py-4 text-[0.85rem] sm:text-[0.92rem]"
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
  const [mounted, setMounted] = useState(false);
  const [pageDims, setPageDims] = useState<{ width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } } | null>(null);

  useEffect(() => {
    // Portals need `document`, which only exists after mount — this
    // one-time setState-on-mount is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Measure the actual available space for the book (a two-page spread)
  // once the modal has laid out, and size the book to fill it — this is
  // what makes it appear "zoomed"/large rather than a small fixed card,
  // and since pagination below uses these exact same numbers, nothing
  // that fits in this space can ever get clipped.
  useEffect(() => {
    if (!open) {
      // Reset measurement state when the modal closes so it re-measures
      // fresh next time it opens, rather than reusing stale dimensions.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPageDims(null);
      return;
    }
    const updateDims = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = Math.max(240, Math.floor(rect.width / 2));
      const height = Math.max(340, Math.floor(rect.height));
      setPageDims({ width, height });
    };
    const raf = requestAnimationFrame(updateDims);
    window.addEventListener("resize", updateDims);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateDims);
    };
  }, [open]);

  const pages = useMemo(() => {
    if (!pageDims) return [];
    return paginate(html, pageDims.width, pageDims.height);
  }, [html, pageDims]);

  // Lock background scroll while the overlay is open, and always start
  // back at the top of the viewport rather than wherever the underlying
  // page happened to be scrolled to.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0 });
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const modal = open && (
    <div className="fixed inset-0 z-[999] bg-gradient-to-b from-ink to-[#100f0d] flex flex-col items-center justify-center p-3 sm:p-8">
      <button
        aria-label="Close print edition"
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 text-paper hover:text-gold bg-white/10 hover:bg-white/15 rounded-full p-2 transition-colors z-10"
      >
        <X size={22} />
      </button>

      <div className="w-full max-w-5xl h-[80vh] sm:h-[85vh] flex items-center justify-center gap-2">
        <button
          aria-label="Previous page"
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-paper transition-colors shrink-0"
        >
          <ChevronLeft size={24} />
        </button>

        <div ref={containerRef} className="h-full w-full flex items-center justify-center">
          {pageDims && pages.length > 0 && (
            <HTMLFlipBook
              width={pageDims.width}
              height={pageDims.height}
              size="fixed"
              usePortrait={false}
              showCover={false}
              mobileScrollSupport={false}
              className="shadow-2xl rounded-sm overflow-hidden"
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
          )}
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
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border hairline-strong px-4 py-2 text-sm font-semibold eyebrow hover:bg-ink hover:text-paper transition-colors"
      >
        <BookOpen size={16} />
        Read in Print Edition
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}