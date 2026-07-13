import type { Metadata } from "next";
import { SITE_URL } from "@/lib/types";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Jagsamvad collects, uses and protects your information, including details on cookies and advertising.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <span className="eyebrow text-xs text-masthead font-bold">Legal</span>
      <h1 className="font-display text-4xl font-black mt-1 mb-2">Privacy Policy</h1>
      <p className="text-sm text-ink-soft mb-8">Last updated: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>

      <div className="article-body">
        <p>
          This Privacy Policy explains how Jagsamvad (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses and protects
          information when you visit jagsamvad.com (the &ldquo;Site&rdquo;).
          By using the Site, you agree to the collection and use of
          information in accordance with this policy.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you voluntarily provide, such as your name
          and email address when you submit our contact form. We also
          automatically collect certain technical information when you visit
          the Site, including your IP address, browser type, device
          information, pages visited and time spent on those pages, through
          cookies and similar technologies.
        </p>

        <h2>Cookies</h2>
        <p>
          Cookies are small text files stored on your device. We use cookies
          to remember your preferences, understand how visitors use the
          Site, and to serve relevant advertising. You can disable cookies
          through your browser settings, though some features of the Site
          may not function properly as a result.
        </p>

        <h2>Third-Party Advertising</h2>
        <p>
          We may use third-party advertising companies, including Google
          AdSense, to serve ads when you visit the Site. These companies may
          use information about your visits to this and other websites to
          provide advertisements about goods and services of interest to
          you. Google&rsquo;s use of advertising cookies enables it and its
          partners to serve ads based on your visits to this site and/or
          other sites on the Internet.
        </p>
        <p>
          You may opt out of personalised advertising by visiting{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          , or by visiting{" "}
          <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
            www.aboutads.info/choices
          </a>{" "}
          to opt out of participating vendors&rsquo; use of cookies.
        </p>

        <h2>How We Use Information</h2>
        <p>
          We use the information we collect to operate and improve the Site,
          respond to enquiries submitted through our contact form, understand
          how our content is used, and to serve advertising. We do not sell
          your personal information to third parties.
        </p>

        <h2>Data Retention &amp; Security</h2>
        <p>
          We retain contact form submissions only as long as necessary to
          respond to your enquiry. We take reasonable technical measures to
          protect information stored in our database, but no method of
          transmission over the Internet is completely secure.
        </p>

        <h2>Children&rsquo;s Privacy</h2>
        <p>
          The Site is not directed at children under 13, and we do not
          knowingly collect personal information from children.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of any
          personal information you have submitted to us by contacting us at{" "}
          <a href="mailto:editor@jagsamvad.com">editor@jagsamvad.com</a>.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes take
          effect immediately upon posting to this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please visit our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
