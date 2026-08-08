"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import SearchBox from "@/components/SearchBox";

export default function MobileSearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        aria-label="Open search"
        onClick={() => setOpen(true)}
        className="p-2 -mr-2 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead rounded"
      >
        <Search size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-start"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-paper border-b hairline-strong px-4 py-4 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1">
              <SearchBox variant="mobile" />
            </div>
            <button
              aria-label="Close search"
              onClick={() => setOpen(false)}
              className="p-2 text-ink shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}