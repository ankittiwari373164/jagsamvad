import Link from "next/link";
import { Search } from "lucide-react";
import { getCategories } from "@/lib/data";
import { SITE_LOCATION, SITE_TAGLINE, SOCIAL_LINKS } from "@/lib/types";
import MobileNav from "@/components/MobileNav";
import { FacebookIcon, InstagramIcon, YoutubeIcon, XIcon } from "@/components/SocialIcons";

export default async function Masthead() {
  const categories = await getCategories();

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  return (
    <header className="bg-paper border-b-4 border-double border-ink hairline-strong sticky top-0 z-40 paper-texture">
      {/* Utility bar */}
      <div className="hidden sm:flex items-center justify-between max-w-6xl mx-auto px-4 py-1.5 text-[11px] eyebrow text-ink-soft border-b hairline">
        <span>
          {today} · {SITE_LOCATION}
        </span>
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-4">
            <span className="text-ink font-bold">Digital Edition</span>
            <Link href="#subscribe" className="hover:text-masthead transition-colors">
              Subscribe
            </Link>
          </nav>
          <div className="flex items-center gap-3 text-ink-soft border-l hairline pl-4">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-masthead transition-colors">
              <FacebookIcon size={13} />
            </a>
            <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-masthead transition-colors">
              <XIcon size={12} />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-masthead transition-colors">
              <InstagramIcon size={13} />
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-masthead transition-colors">
              <YoutubeIcon size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main row: logo left, nav right */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <MobileNav categories={categories} />
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-ink">
              जगसंवाद
            </span>
            <span className="hidden sm:inline text-xs font-normal text-masthead">
              JagSamvad
            </span>
          </Link>
        </div>

        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="eyebrow text-xs font-semibold text-ink hover:text-masthead transition-colors whitespace-nowrap"
          >
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="eyebrow text-xs text-ink hover:text-masthead transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
          <button
            aria-label="Search"
            className="text-ink hover:text-masthead transition-colors p-1 -mr-1"
          >
            <Search size={16} />
          </button>
        </nav>
      </div>

      <p className="sm:hidden eyebrow text-[10px] text-ink-soft text-center pb-2 px-4">
        {SITE_TAGLINE}
      </p>
    </header>
  );
}