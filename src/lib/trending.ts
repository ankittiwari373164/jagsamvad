import "server-only";

const QUERIES = [
  "Bollywood movie",
  "Hollywood movie",
  "Korean drama",
  "OTT release India",
  "Netflix India",
];

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "is", "are", "was", "were", "be", "been", "being", "this", "that",
  "it", "its", "as", "by", "from", "new", "news", "says", "after", "over",
  "into", "about", "how", "what", "why", "who", "will", "has", "have",
]);

export type TrendingKeyword = { keyword: string; count: number };

/**
 * Pulls recent headlines from Google News RSS for a fixed set of
 * entertainment-industry queries, and extracts candidate proper-noun-ish
 * keywords by frequency. Free and requires no API key, but is inherently
 * a lighter-weight signal than a real trends API — treat results as
 * directional, not authoritative.
 */
export async function fetchTrendingKeywords(): Promise<TrendingKeyword[]> {
  const headlines: string[] = [];

  await Promise.all(
    QUERIES.map(async (q) => {
      try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; JagsamvadBot/1.0)" },
          next: { revalidate: 0 },
        });
        if (!res.ok) return;
        const xml = await res.text();
        const titles = Array.from(xml.matchAll(/<title>([^<]*)<\/title>/g)).map((m) => m[1]);
        // First <title> is the feed title itself, skip it.
        headlines.push(...titles.slice(1));
      } catch {
        // A single failed feed shouldn't take down the whole run.
      }
    })
  );

  const counts = new Map<string, number>();
  for (const headline of headlines) {
    const words = headline
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .split(/[\s\-–—:|,.'"()]+/)
      .filter(Boolean);

    let phrase: string[] = [];
    const flush = () => {
      if (phrase.length >= 1 && phrase.length <= 4) {
        const key = phrase.join(" ");
        if (key.length >= 3 && !STOP_WORDS.has(key.toLowerCase())) {
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
      phrase = [];
    };
    for (const word of words) {
      const clean = word.replace(/[^A-Za-z0-9']/g, "");
      const isCapitalized = /^[A-Z][a-z0-9']*$/.test(clean);
      const isStop = STOP_WORDS.has(clean.toLowerCase());
      if (isCapitalized && !isStop) {
        phrase.push(clean);
      } else {
        flush();
      }
    }
    flush();
  }

  return Array.from(counts.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .filter((k) => k.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}