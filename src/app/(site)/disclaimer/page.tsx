import type { Metadata } from "next";
import { SITE_URL } from "@/lib/types";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer regarding the entertainment news, opinions and images published on Jagsamvad.",
  alternates: { canonical: `${SITE_URL}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <span className="eyebrow text-xs text-masthead font-bold">Legal</span>
      <h1 className="font-display text-4xl font-black mt-1 mb-8">Disclaimer</h1>

      <div className="article-body">
        <p>
          The information published on Jagsamvad is provided for general
          informational and entertainment purposes only. While we strive to
          keep our reporting accurate and up to date, we make no
          representations or warranties of any kind, express or implied,
          about the completeness, accuracy, reliability or availability of
          any information on the Site.
        </p>

        <h2>Entertainment News</h2>
        <p>
          Movie release dates, cast details, box-office numbers, streaming
          availability and similar information are subject to change by the
          studios, production houses and platforms involved, often without
          notice. Readers should verify time-sensitive details, such as
          release dates and ticket availability, directly with the official
          source before making plans.
        </p>

        <h2>Opinions</h2>
        <p>
          Reviews and opinion pieces published on the Site reflect the views
          of the individual author and not necessarily those of Jagsamvad as
          a publication.
        </p>

        <h2>Images &amp; Trademarks</h2>
        <p>
          Movie posters, stills and promotional images used on the Site are
          used for editorial, illustrative purposes under fair use, and
          remain the property of their respective copyright holders. All
          trademarks, logos and brand names referenced are the property of
          their respective owners.
        </p>

        <h2>External Links</h2>
        <p>
          Our articles may link to external websites, including official
          studio pages, streaming platforms and social media posts. We do
          not control and are not responsible for the content of external
          sites.
        </p>

        <h2>No Professional Advice</h2>
        <p>
          Nothing on this Site constitutes legal, financial or professional
          advice of any kind.
        </p>

        <h2>Contact</h2>
        <p>
          If you believe content on this Site infringes your rights or
          contains an error, please reach out via our{" "}
          <a href="/contact">Contact page</a> and we will review it promptly.
        </p>
      </div>
    </div>
  );
}
