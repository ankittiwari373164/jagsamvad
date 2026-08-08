"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export default function SubscribeModal({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Subscribe to our newsletter"
          className="fixed inset-0 z-[60] bg-ink/50 flex items-center justify-center px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 bg-ink text-paper rounded-full p-1.5 hover:bg-masthead transition-colors z-10"
            >
              <X size={16} />
            </button>
            <NewsletterForm withAnchor={false} />
          </div>
        </div>
      )}
    </>
  );
}
