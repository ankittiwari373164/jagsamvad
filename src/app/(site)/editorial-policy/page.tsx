import type { Metadata } from "next";
import { SITE_URL } from "@/lib/types";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "How the Jagsamvad newsroom sources, verifies and corrects its reporting.",
  alternates: { canonical: `${SITE_URL}/editorial-policy` },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <span className="eyebrow text-xs text-masthead font-bold">Legal</span>
      <h1 className="font-display text-4xl font-black mt-1 mb-8">Editorial Policy</h1>

      <div className="article-body">
        <p>
          Jagsamvad is an entertainment newsroom covering Bollywood,
          Hollywood, Korean cinema and OTT releases. This page explains how
          we source, write and correct our journalism.
        </p>

        <h2>Sourcing</h2>
        <p>
          Our reporting draws on official studio and platform announcements,
          verified social media posts from cast, crew and production
          houses, trade publications, and press events. Where a claim is
          unconfirmed or based on a single source, we say so in the article.
        </p>

        <h2>Independence</h2>
        <p>
          Editorial decisions — what we cover and how we cover it — are made
          independently of advertising relationships. Advertisements on the
          Site, including those served through Google AdSense, do not
          influence our reporting or reviews.
        </p>

        <h2>Bylines &amp; Attribution</h2>
        <p>
          Every article carries a byline identifying its author and a
          publish date. Reviews and opinion content are clearly labelled as
          such and reflect the individual writer&rsquo;s view.
        </p>

        <h2>Corrections</h2>
        <p>
          When we get something wrong — a name, a date, a figure — we correct
          it as soon as we can verify the right information. Substantive
          corrections are noted within the article. If you spot an error,
          please tell us via our <a href="/contact">Contact page</a>.
        </p>

        <h2>Images</h2>
        <p>
          Cover images and in-article visuals are used for editorial,
          illustrative purposes and are credited to their source where
          required.
        </p>

        <h2>Questions</h2>
        <p>
          For any editorial query, write to us at{" "}
          <a href="mailto:editor@jagsamvad.com">editor@jagsamvad.com</a>.
        </p>
      </div>
    </div>
  );
}
