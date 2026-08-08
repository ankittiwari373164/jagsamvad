import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { SOCIAL_LINKS, SITE_URL } from "@/lib/types";
import { TelegramIcon, WhatsappIcon, InstagramIcon, XIcon, FacebookIcon, YoutubeIcon } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Jagsamvad newsroom — story tips, corrections, partnerships or general queries.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <span className="eyebrow text-xs text-masthead font-bold">Get in touch</span>
      <h1 className="font-display text-4xl font-black mt-1 mb-3">Contact Us</h1>
      <p className="text-ink-soft max-w-xl mb-10 leading-relaxed">
        Have a story tip, a correction to flag, or a partnership enquiry?
        Send us a message below — a real person on the Jagsamvad desk reads
        every submission.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <div className="border hairline-strong bg-white p-6">
            <ContactForm />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border hairline-strong bg-white p-6">
            <h2 className="eyebrow text-xs text-masthead font-bold mb-4">Reach Us Directly</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Mail size={16} className="text-masthead mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Editorial &amp; General Queries</p>
                  <a href="mailto:editor@jagsamvad.com" className="text-ink-soft hover:text-masthead transition-colors">
                    editor@jagsamvad.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin size={16} className="text-masthead mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Newsroom</p>
                  <p className="text-ink-soft">New Delhi, India</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-masthead mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Response Time</p>
                  <p className="text-ink-soft">We typically reply within 2–3 business days.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="border hairline-strong bg-white p-6">
            <h2 className="eyebrow text-xs text-masthead font-bold mb-4">Follow the Desk</h2>
            <div className="flex flex-col gap-2">
              <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#229ED9] hover:bg-[#1c86ba] px-4 py-2.5 transition-colors">
                <TelegramIcon size={14} /> Telegram Channel
              </a>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1fb457] px-4 py-2.5 transition-colors">
                <WhatsappIcon size={14} /> WhatsApp Channel
              </a>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t hairline text-ink-soft">
              <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-masthead transition-colors"><XIcon size={16} /></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-masthead transition-colors"><InstagramIcon size={16} /></a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-masthead transition-colors"><FacebookIcon size={16} /></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-masthead transition-colors"><YoutubeIcon size={17} /></a>
            </div>
          </div>

          <p className="text-xs text-ink-soft leading-relaxed">
            For copyright or takedown requests, please see our{" "}
            <a href="/terms-and-conditions" className="text-masthead hover:underline">Terms &amp; Conditions</a>.
            For how we handle the information you submit here, see our{" "}
            <a href="/privacy-policy" className="text-masthead hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
