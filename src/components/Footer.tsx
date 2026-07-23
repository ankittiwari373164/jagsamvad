import Link from "next/link";
import { Heart } from "lucide-react";
import { getCategories } from "@/lib/data";
import { SOCIAL_LINKS } from "@/lib/types";
import { FacebookIcon, InstagramIcon, YoutubeIcon, XIcon } from "@/components/SocialIcons";

const legalLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/editorial-policy", label: "Editorial Policy" },
];

export default async function Footer() {
  const categories = await getCategories();
  const mid = Math.ceil(categories.length / 2);
  const colA = categories.slice(0, mid);
  const colB = categories.slice(mid);

  return (
    <footer className="bg-ink text-paper mt-12 paper-texture">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8">
        <div>
          <h2 className="font-display text-2xl font-bold">जगसंवाद</h2>
          <p className="text-xs text-gold eyebrow mt-0.5">JagSamvad</p>
          <p className="text-sm text-paper/70 mt-3 leading-relaxed">
            Jagsamvad brings you daily coverage of Bollywood, Hollywood,
            Korean and everything in between.
          </p>
          <div className="flex items-center gap-4 mt-4 text-paper/80">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold transition-colors">
              <FacebookIcon size={16} />
            </a>
            <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-gold transition-colors">
              <XIcon size={15} />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold transition-colors">
              <InstagramIcon size={16} />
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-gold transition-colors">
              <YoutubeIcon size={17} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-xs text-gold mb-3">Categories</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {colA.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="text-paper/80 hover:text-gold transition-colors">
                {c.name}
              </Link>
            ))}
            {colB.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="text-paper/80 hover:text-gold transition-colors">
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-xs text-gold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-paper/80 hover:text-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-xs text-gold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>
              Email:{" "}
              <a href="mailto:editor@jagsamvad.com" className="hover:text-gold transition-colors">
                editor@jagsamvad.com
              </a>
            </li>
            <li>New Delhi, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-paper/60 eyebrow">
          <p>© {new Date().getFullYear()} Jagsamvad. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={11} className="fill-masthead text-masthead" /> for news lovers
          </p>
        </div>
      </div>
    </footer>
  );
}