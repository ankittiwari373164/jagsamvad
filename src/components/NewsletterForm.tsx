"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions/newsletter";

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
    </div>
  );
}
