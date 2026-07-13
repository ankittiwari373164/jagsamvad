import { createClient } from "@/lib/supabase/server";
import AuthorManager from "@/components/admin/AuthorManager";

export default async function AdminAuthorsPage() {
  const supabase = await createClient();
  const { data: authors } = await supabase.from("authors").select("*").order("name");

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Authors</h1>
      <p className="text-sm text-slate-500 mb-8">Manage bylines for your stories.</p>
      <AuthorManager authors={authors ?? []} />
    </div>
  );
}
