import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import PageFlipTransition from "@/components/PageFlipTransition";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:text-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Masthead />
      <main id="main-content">
        <PageFlipTransition>{children}</PageFlipTransition>
      </main>
      <Footer />

      {/* Only loads once you set a real GA4 measurement ID — never ships
          a fake/placeholder tracking ID. Deliberately scoped to the
          public site layout so your own admin-panel activity is never
          counted in the analytics. */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </>
  );
}