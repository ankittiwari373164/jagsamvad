import { slugify } from "@/lib/utils";

export type TocItem = { id: string; text: string; level: 2 | 3 | 4 };

function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

/**
 * Scans article HTML for <h2>/<h3>/<h4> tags, gives each one a stable,
 * unique `id` (so they can be linked to), and returns both the rewritten
 * HTML and a flat list of {id, text, level} entries for rendering a
 * Table of Contents.
 */
export function extractTocAndAddIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const withIds = html.replace(
    /<h([234])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match: string, level: string, attrs: string, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]+>/g, "").trim());
      if (!text) return match;

      let id = slugify(text) || "section";
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;

      toc.push({ id, text, level: Number(level) as 2 | 3 | 4 });

      // Strip any pre-existing id from attrs (shouldn't normally happen,
      // but keeps this idempotent) then add ours.
      const cleanAttrs = attrs.replace(/\sid="[^"]*"/, "");
      return `<h${level} id="${id}"${cleanAttrs}>${inner}</h${level}>`;
    }
  );

  return { html: withIds, toc };
}

export const TOC_MARKER = "[[TOC]]";

/**
 * Finds a paragraph whose text content is exactly the TOC marker
 * (inserted via the editor's "Insert Table of Contents" button) and
 * splits the surrounding HTML around it, so the caller can render the
 * actual <TableOfContents> component at that exact spot. Returns null
 * if no marker paragraph is present, so callers can fall back to their
 * own default placement.
 */
export function splitAtTocMarker(html: string): { before: string; after: string } | null {
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
  let match: RegExpExecArray | null;

  while ((match = paragraphRegex.exec(html)) !== null) {
    const inner = match[1].replace(/<[^>]+>/g, "").trim();
    if (inner === TOC_MARKER) {
      const start = match.index;
      const end = start + match[0].length;
      return { before: html.slice(0, start), after: html.slice(end) };
    }
  }

  return null;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders a Table of Contents as a raw HTML string (with the `.toc-box`
 * styling defined in globals.css). Used for contexts that can't render a
 * React component inline — namely the flip-book print edition, which
 * paginates raw HTML strings.
 */
export function renderTocHtml(toc: TocItem[]): string {
  if (toc.length < 2) return "";
  const items = toc
    .map(
      (item) =>
        `<li style="margin-left:${(item.level - 2) * 16}px"><a href="#${item.id}">${escapeHtml(item.text)}</a></li>`
    )
    .join("");
  return `<div class="toc-box"><p class="toc-label">In This Article</p><ol>${items}</ol></div>`;
}

/**
 * Prepares article HTML for a raw-HTML rendering context (the flip-book):
 * replaces the `[[TOC]]` marker with an actual rendered Table of Contents,
 * or — if no marker was placed — prepends the TOC before the content.
 * Guarantees the literal marker text never leaks into the output.
 */
export function prepareHtmlWithToc(html: string, toc: TocItem[]): string {
  const tocHtml = renderTocHtml(toc);
  const split = splitAtTocMarker(html);

  if (split) {
    return `${split.before}${tocHtml}${split.after}`;
  }
  return tocHtml ? `${tocHtml}${html}` : html;
}