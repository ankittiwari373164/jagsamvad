import { createClient } from "@/lib/supabase/server";
import ArticleForm from "@/components/admin/ArticleForm";
import { createArticle } from "@/app/actions/articles";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: authors }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("authors").select("*").order("name"),
  ]);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">New Article</h1>
      <p className="text-sm text-slate-500 mb-8">Write and publish a new story.</p>
      <ArticleForm
        categories={categories ?? []}
        authors={authors ?? []}
        action={createArticle}
        submitLabel="Save Article"
      />
    </div>
  );
}
