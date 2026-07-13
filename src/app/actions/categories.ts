"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type CategoryFormState = { status: "idle" | "error" | "success"; message?: string };

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;

  if (!name) return { status: "error", message: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(slugInput || name),
    description,
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { status: "success", message: "Category created." };
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;

  if (!name) return { status: "error", message: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(slugInput || name), description })
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { status: "success", message: "Category updated." };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
