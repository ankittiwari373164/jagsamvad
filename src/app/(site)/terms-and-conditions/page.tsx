import type { Metadata } from "next";
import { SITE_URL } from "@/lib/types";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions governing your use of Jagsamvad.",
  alternates: { canonical: `${SITE_URL}/terms-and-conditions` },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <span className="eyebrow text-xs text-masthead font-bold">Legal</span>
      <h1 className="font-display text-4xl font-black mt-1 mb-8">Terms &amp; Conditions</h1>

      <div className="article-body">
        <p>
          These Terms &amp; Conditions govern your use of jagsamvad.com (the
          &ldquo;Site&rdquo;). By accessing or using the Site, you agree to
          be bound by these terms. If you do not agree, please discontinue
          use of the Site.
        </p>

        <h2>Use of Content</h2>
        <p>
          All articles, images, graphics and other content published on the
          Site are the property of Jagsamvad or its licensors, unless
          otherwise credited. You may share links to our articles and quote
          brief excerpts with proper attribution and a link back to the
          original article. Reproduction of full articles or substantial
          portions without written permission is prohibited.
        </p>

        <h2>Accuracy of Information</h2>
        <p>
          We work to ensure our reporting is accurate at the time of
          publication. Entertainment news — release dates, cast
          announcements, box-office figures — can change after we publish.
          We are not liable for decisions made based on information that
          later changes.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          The Site may contain links to third-party websites, including
          streaming platforms and social media. We are not responsible for
          the content, privacy practices or availability of external sites.
        </p>

        <h2>User Conduct</h2>
        <p>
          If the Site offers comment or submission features, you agree not
          to post content that is unlawful, defamatory, harassing or
          infringes on the rights of others. We reserve the right to remove
          such content and restrict access where necessary.
        </p>

        <h2>Advertising</h2>
        <p>
          The Site displays advertising, including through Google AdSense,
          to support free access to our journalism. Advertisements are
          served by third parties and their content does not represent an
          endorsement by Jagsamvad.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          The Site and its content are provided &ldquo;as is&rdquo; without
          warranties of any kind. Jagsamvad shall not be liable for any
          damages arising from your use of, or inability to use, the Site.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may revise these Terms &amp; Conditions at any time. Continued
          use of the Site after changes are posted constitutes acceptance of
          the updated terms.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of India, without regard to
          its conflict-of-law provisions.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent through our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
