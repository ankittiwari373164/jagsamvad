"use client";

import { useActionState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { SOCIAL_LINKS } from "@/lib/types";

const initialState: NewsletterState = { status: "idle" };

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <div id="subscribe" className="border hairline-strong bg-white p-5">
      <h2 className="eyebrow text-xs text-masthead font-bold mb-1.5">Stay Updated</h2>
      <p className="text-xs text-ink-soft mb-3 leading-relaxed">
        Subscribe to our newsletter for the latest updates delivered to your
        inbox.
      </p>
      <form action={formAction} className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="flex-1 min-w-0 border hairline-strong px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
        />
        <button
          type="submit"
          disabled={pending}
          className="eyebrow text-[10px] font-bold bg-masthead text-paper px-4 py-2 hover:bg-masthead-dark transition-colors disabled:opacity-60 shrink-0"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </form>
      {state.status !== "idle" && (
        <p
          className={`text-xs mt-2 ${
            state.status === "success" ? "text-green-800" : "text-masthead"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t hairline">
        <a
          href={SOCIAL_LINKS.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#229ED9] hover:bg-[#1c86ba] px-4 py-2.5 transition-colors"
        >
          <Send size={14} />
          Join on Telegram
        </a>
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1fb457] px-4 py-2.5 transition-colors"
        >
          <MessageCircle size={14} />
          Join on WhatsApp
        </a>
      </div>
    </div>
  );
}