"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Wraps every public page so that navigating to a new page — or back to a
 * previous one — plays a newspaper-style page turn instead of an instant
 * swap. Works for forward navigation, category/article links, and the
 * browser Back button, since all of those change the pathname that drives
 * this transition.
 */
export default function PageFlipTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div style={{ perspective: "1800px" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ rotateY: -8, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 8, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.45, 0, 0.2, 1] }}
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
