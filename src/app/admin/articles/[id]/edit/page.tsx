import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArticleForm from "@/components/admin/ArticleForm";
import SeoScoreCard from "@/components/admin/SeoScoreCard";
import { updateArticle } from "@/app/actions/articles";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: article }, { data: categories }, { data: authors }] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("authors").select("*").order("name"),
  ]);

  if (!article) notFound();

  const boundUpdate = updateArticle.bind(null, id);

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Article</h1>
      <p className="text-sm text-slate-500 mb-8">Update and republish this story.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <ArticleForm
            categories={categories ?? []}
            authors={authors ?? []}
            article={article}
            action={boundUpdate}
            submitLabel="Update Article"
          />
        </div>
        <div className="lg:sticky lg:top-8">
          <SeoScoreCard article={article} />
        </div>
      </div>
    </div>
  );
}