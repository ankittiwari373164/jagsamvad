import type { Metadata } from "next";
import { SITE_URL } from "@/lib/types";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Jagsamvad editorial team — tips, corrections, feedback and partnership enquiries.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <span className="eyebrow text-xs text-masthead font-bold">Contact</span>
      <h1 className="font-display text-4xl font-black mt-1 mb-4">Contact Us</h1>
      <p className="text-ink-soft mb-8 leading-relaxed">
        Have a news tip, a correction to report, or a partnership enquiry?
        Send us a message below, or write to us directly at{" "}
        <a href="mailto:editor@jagsamvad.com" className="text-masthead underline underline-offset-2">
          editor@jagsamvad.com
        </a>
        .
      </p>
      <ContactForm />
    </div>
  );
}
