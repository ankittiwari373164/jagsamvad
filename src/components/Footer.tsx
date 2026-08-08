import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { getCategories } from "@/lib/data";
import { SOCIAL_LINKS } from "@/lib/types";
import { FacebookIcon, InstagramIcon, YoutubeIcon, XIcon, TelegramIcon, WhatsappIcon } from "@/components/SocialIcons";

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

  return (
    <footer className="bg-ink text-paper mt-12 paper-texture">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8">
        <div>
          <Image
            src="/wordmark-logo.png"
            alt="Jagsamvad"
            width={2000}
            height={522}
            className="h-8 w-auto"
          />
          <p className="text-sm text-paper/70 mt-3 leading-relaxed">
            Jagsamvad brings you daily coverage of Bollywood, Hollywood,
            Korean and everything in between.
          </p>
          <div className="flex items-center gap-4 mt-4 text-paper/80">
            <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-gold transition-colors">
              <TelegramIcon size={16} />
            </a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-gold transition-colors">
              <WhatsappIcon size={16} />
            </a>
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
          <div className="flex flex-col gap-2 text-sm">
            {categories.map((c) => (
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
          <ul className="space-y-2 text-sm text-paper/80 mb-4">
            <li>
              Email:{" "}
              <a href="mailto:editor@jagsamvad.com" className="hover:text-gold transition-colors">
                editor@jagsamvad.com
              </a>
            </li>
            <li>New Delhi, India</li>
          </ul>
          <div className="flex flex-col gap-2">
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#229ED9] hover:bg-[#1c86ba] px-3 py-2 transition-colors"
            >
              <TelegramIcon size={13} />
              Telegram Channel
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1fb457] px-3 py-2 transition-colors"
            >
              <WhatsappIcon size={13} />
              WhatsApp Channel
            </a>
          </div>
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