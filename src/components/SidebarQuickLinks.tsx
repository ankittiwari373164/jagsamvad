import Link from "next/link";
import { Flame, PlayCircle, CalendarDays, Clapperboard, Globe2 } from "lucide-react";

const links = [
  { href: "/", label: "Most Read", icon: Flame },
  { href: "/category/ott-release", label: "Top OTT Releases", icon: PlayCircle },
  { href: "/category/movies", label: "Upcoming Movies", icon: CalendarDays },
  { href: "/category/bollywood", label: "Bollywood Buzz", icon: Clapperboard },
  { href: "/category/korean-movies", label: "Korean Corner", icon: Globe2 },
];

export default function SidebarQuickLinks() {
  return (
    <div className="border hairline-strong bg-white divide-y divide-black/10">
      {links.map((l) => {
        const Icon = l.icon;
        return (
          <Link
            key={l.label}
            href={l.href}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-paper-dim transition-colors"
          >
            <Icon size={16} className="text-masthead shrink-0" />
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
