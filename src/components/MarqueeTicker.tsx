import Link from "next/link";

type TickerItem = { title: string; slug: string };

export default function MarqueeTicker({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null;

  // Duplicate the list so the CSS loop can wrap seamlessly at -50%.
  const loop = [...items, ...items];

  return (
    <div className="bg-masthead text-paper">
      <div className="max-w-6xl mx-auto flex items-center">
        <span className="eyebrow text-[10px] font-bold bg-paper text-masthead px-3 py-2.5 shrink-0 z-10">
          Breaking
        </span>
        <div className="marquee-wrap flex-1 overflow-hidden py-2.5">
          <div className="marquee-track flex items-center gap-12 whitespace-nowrap w-max">
            {loop.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/article/${item.slug}`}
                className="text-sm hover:underline shrink-0"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
