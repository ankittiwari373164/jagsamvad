export type LinkableArticle = { slug: string; title: string };

const MAX_LINKS = 5;
const MIN_PHRASE_WORDS = 2; // avoid linking on a single common word
const SKIP_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "h5", "h6"]);

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scans article HTML and auto-links the first mention of other articles'
 * titles to those articles — lightweight internal linking for SEO.
 *
 * Unlike a naive `html.replace(regex, ...)` over the raw HTML string
 * (which can match text inside tag attributes — e.g. an `alt="..."` that
 * happens to contain another headline — or nest a link inside an
 * existing `<a>`, producing invalid/broken markup), this splits the HTML
 * into alternating tag/text segments first and only ever replaces inside
 * real text content, and tracks whether it's currently inside an `<a>`
 * or heading tag so those are skipped entirely.
 */
export function injectSmartLinks(
  html: string,
  currentSlug: string,
  articles: LinkableArticle[]
): string {
  if (!html) return html;

  const candidates = articles
    .filter((a) => a.slug !== currentSlug && a.title?.trim())
    .map((a) => {
      const words = a.title.trim().split(/\s+/);
      const phrase = words.slice(0, Math.min(5, words.length)).join(" ");
      return { slug: a.slug, phrase };
    })
    .filter((a) => a.phrase.split(/\s+/).length >= MIN_PHRASE_WORDS);

  if (candidates.length === 0) return html;

  const segments = html.split(/(<[^>]+>)/);

  let linksUsed = 0;
  let skipDepth = 0;
  const usedSlugs = new Set<string>();

  for (let i = 0; i < segments.length && linksUsed < MAX_LINKS; i++) {
    const seg = segments[i];
    if (!seg) continue;

    if (seg.startsWith("<")) {
      const tagMatch = seg.match(/^<\/?([a-zA-Z0-9]+)/);
      const tagName = tagMatch?.[1]?.toLowerCase();
      if (tagName && SKIP_TAGS.has(tagName)) {
        skipDepth += seg.startsWith("</") ? -1 : 1;
        if (skipDepth < 0) skipDepth = 0;
      }
      continue;
    }

    if (skipDepth > 0) continue;

    for (const candidate of candidates) {
      if (linksUsed >= MAX_LINKS) break;
      if (usedSlugs.has(candidate.slug)) continue;

      const regex = new RegExp(`\\b(${escapeRegex(candidate.phrase)})\\b`, "i");
      if (regex.test(segments[i])) {
        segments[i] = segments[i].replace(
          regex,
          `<a href="/article/${candidate.slug}" class="text-masthead underline underline-offset-2 hover:no-underline">$1</a>`
        );
        linksUsed++;
        usedSlugs.add(candidate.slug);
        break;
      }
    }
  }

  return segments.join("");
}