import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { Mail } from "lucide-react";

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Newsletter Subscribers</h1>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Everyone who signed up via the header popup or homepage form.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Mail size={18} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{count ?? 0}</p>
          <p className="text-xs text-slate-500">Total subscribers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {!subscribers || subscribers.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-500 text-center">No subscribers yet.</p>
        ) : (
          subscribers.map((s) => (
            <div key={s.id} className="px-5 py-3 flex items-center justify-between">
              <span className="text-sm text-slate-800">{s.email}</span>
              <span className="text-xs text-slate-400">{formatDateTime(s.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
