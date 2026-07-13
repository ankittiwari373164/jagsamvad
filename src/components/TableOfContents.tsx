import type { TocItem } from "@/lib/toc";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="border hairline-strong bg-paper-dim px-5 py-4 mb-8"
    >
      <p className="eyebrow text-xs text-masthead font-bold mb-2.5">
        In This Article
      </p>
      <ol className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: (item.level - 2) * 16 }}>
            <a
              href={`#${item.id}`}
              className="text-ink hover:text-masthead hover:underline underline-offset-2"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}