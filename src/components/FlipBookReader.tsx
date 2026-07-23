"use client";

import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

// Must match the Page component's actual rendered dimensions below —
// pagination measures against these so pages are filled properly instead
// of guessed from character counts.
const PAGE_WIDTH = 420;
const PAGE_HEIGHT = 640;
const CONTENT_HORIZONTAL_PADDING = 64; // px-8 on both sides
const CONTENT_HEIGHT = 480; // available height for body content, chrome (header/footer/padding) subtracted with margin

function serialize(elements: Element[]): string {
  return elements.map((el) => el.outerHTML).join("");
}

/**
 * Paginates by actually rendering candidate content into a hidden,
 * identically-styled measuring element and checking its real height —
 * rather than estimating from character counts, which either wastes
 * space (way under-filled pages) or clips content (overflow). This is
 * what makes pages behave like an actual book.
 */
function paginate(html: string): string[] {
  if (typeof window === "undefined") return [html];

  const measurer = document.createElement("div");
  measurer.className = "article-body";
  Object.assign(measurer.style, {
    position: "fixed",
    visibility: "hidden",
    pointerEvents: "none",
    top: "-9999px",
    left: "-9999px",
    width: `${PAGE_WIDTH - CONTENT_HORIZONTAL_PADDING}px`,
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
    if (current.length > 0 && measure(trial) > CONTENT_HEIGHT) {
      pages.push(serialize(current));
      current = [node];
    } else {
      current = trial;
    }
    // A single node that alone doesn't fit (e.g. a large image) gets its
    // own page immediately, rather than waiting for a sibling to trigger
    // the overflow check above.
    if (current.length === 1 && measure(current) > CONTENT_HEIGHT) {
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
  const pages = useMemo(() => paginate(html), [html]);
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } } | null>(null);

  useEffect(() => {
    // Portals need `document`, which only exists after mount — this
    // one-time setState-on-mount is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
            width={PAGE_WIDTH}
            height={PAGE_HEIGHT}
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