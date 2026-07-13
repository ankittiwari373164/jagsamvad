import type { Metadata } from "next";
import { SITE_URL } from "@/lib/types";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Jagsamvad is a digital newspaper covering Bollywood, Hollywood, Korean cinema and OTT releases. Learn about our mission and team.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <span className="eyebrow text-xs text-masthead font-bold">About</span>
      <h1 className="font-display text-4xl font-black mt-1 mb-6">About Jagsamvad</h1>

      <div className="article-body">
        <p>
          Jagsamvad — जगसंवाद, literally &ldquo;a dialogue with the world&rdquo; —
          is a digital newspaper dedicated to entertainment journalism. We
          cover the stories, releases and conversations shaping Bollywood,
          Hollywood and Korean cinema, along with what&rsquo;s new to stream
          across OTT platforms.
        </p>
        <h2>What we cover</h2>
        <p>
          Our newsroom is organised into five desks: Movies, OTT Release,
          Bollywood, Hollywood and Korean Movies. Each desk publishes news
          reports, reviews, cast and release updates, and explainers written
          for readers who want the story without the noise.
        </p>
        <h2>Our approach</h2>
        <p>
          We aim to report quickly without sacrificing accuracy. Every
          article is attributed to an author, dated, and where facts are
          corrected after publication, the article is updated transparently.
          Read our{" "}
          <a href="/editorial-policy">editorial policy</a> for details on how
          our newsroom operates and how we handle corrections.
        </p>
        <h2>Get in touch</h2>
        <p>
          Have a tip, correction or partnership enquiry? Visit our{" "}
          <a href="/contact">Contact page</a> — we read every message.
        </p>
      </div>
    </div>
  );
}
