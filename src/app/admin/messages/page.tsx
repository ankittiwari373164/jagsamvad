import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Messages</h1>
      <p className="text-sm text-slate-500 mb-8">
        Submissions from the Contact Us form.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {!messages || messages.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-500 text-center">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="px-5 py-4">
              <div className="flex items-center justify-between gap-4 mb-1.5">
                <p className="text-sm font-semibold text-slate-800">
                  {m.name}{" "}
                  <a href={`mailto:${m.email}`} className="text-indigo-600 font-normal hover:underline">
                    {m.email}
                  </a>
                </p>
                <p className="text-xs text-slate-400 shrink-0">{formatDateTime(m.created_at)}</p>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
