"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="eyebrow text-xs block mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full border hairline-strong bg-paper px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
        />
      </div>
      <div>
        <label htmlFor="email" className="eyebrow text-xs block mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border hairline-strong bg-paper px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
        />
      </div>
      <div>
        <label htmlFor="message" className="eyebrow text-xs block mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border hairline-strong bg-paper px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-masthead"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="eyebrow text-xs font-bold bg-ink text-paper px-6 py-3 hover:bg-masthead transition-colors disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>

      {state.status === "success" && (
        <p className="text-sm text-green-800 bg-green-50 border border-green-200 px-3 py-2">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-masthead bg-masthead/5 border border-masthead/30 px-3 py-2">
          {state.message}
        </p>
      )}
    </form>
  );
}
