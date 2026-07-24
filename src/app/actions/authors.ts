"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type AuthorFormState = { status: "idle" | "error" | "success"; message?: string };

export async function createAuthor(
  _prevState: AuthorFormState,
  formData: FormData
): Promise<AuthorFormState> {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const bio = String(formData.get("bio") || "").trim() || null;
  const avatar_url = String(formData.get("avatar_url") || "").trim() || null;
  const twitter_url = String(formData.get("twitter_url") || "").trim() || null;
  const linkedin_url = String(formData.get("linkedin_url") || "").trim() || null;

  if (!name) return { status: "error", message: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("authors").insert({
    name,
    slug: slugify(slugInput || name),
    bio,
    avatar_url,
    twitter_url,
    linkedin_url,
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/authors");
  return { status: "success", message: "Author created." };
}

export async function updateAuthor(
  id: string,
  _prevState: AuthorFormState,
  formData: FormData
): Promise<AuthorFormState> {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const bio = String(formData.get("bio") || "").trim() || null;
  const avatar_url = String(formData.get("avatar_url") || "").trim() || null;
  const twitter_url = String(formData.get("twitter_url") || "").trim() || null;
  const linkedin_url = String(formData.get("linkedin_url") || "").trim() || null;

  if (!name) return { status: "error", message: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("authors")
    .update({ name, slug: slugify(slugInput || name), bio, avatar_url, twitter_url, linkedin_url })
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/authors");
  return { status: "success", message: "Author updated." };
}

export async function deleteAuthor(id: string) {
  const supabase = await createClient();
  await supabase.from("authors").delete().eq("id", id);
  revalidatePath("/admin/authors");
}