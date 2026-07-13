import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import PageFlipTransition from "@/components/PageFlipTransition";

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
    </>
  );
}
