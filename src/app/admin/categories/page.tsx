import { createClient } from "@/lib/supabase/server";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Categories</h1>
      <p className="text-sm text-slate-500 mb-8">Organize your newsroom desks.</p>
      <CategoryManager categories={categories ?? []} />
    </div>
  );
}
