"use server";

import { createClient } from "@/lib/supabase/server";

export type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get("email") || "").trim();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { status: "success", message: "You're already subscribed — thanks!" };
    }
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "Subscribed! Welcome to Jagsamvad." };
}
