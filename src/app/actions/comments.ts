"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CommentState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitComment(
  _prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const articleId = String(formData.get("article_id") || "").trim();
  const articleSlug = String(formData.get("article_slug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!articleId || !name || !email || !body) {
    return { status: "error", message: "Please fill in every field." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (body.length > 2000) {
    return { status: "error", message: "Comments are limited to 2000 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    article_id: articleId,
    name,
    email,
    body,
  });

  if (error) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  if (articleSlug) revalidatePath(`/article/${articleSlug}`);

  return {
    status: "success",
    message: "Thanks — your comment has been submitted and will appear once approved.",
  };
}

// ---- Admin moderation ----

export async function approveComment(id: string) {
  const supabase = await createClient();
  await supabase.from("comments").update({ is_approved: true }).eq("id", id);
  revalidatePath("/admin/comments");
}

export async function rejectComment(id: string) {
  const supabase = await createClient();
  await supabase.from("comments").update({ is_approved: false }).eq("id", id);
  revalidatePath("/admin/comments");
}

export async function deleteComment(id: string) {
  const supabase = await createClient();
  await supabase.from("comments").delete().eq("id", id);
  revalidatePath("/admin/comments");
}
