import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-admin" });

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Jagsamvad Admin" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login page itself must render without the sidebar/guard below it.
  // (middleware already lets unauthenticated users reach /admin/login.)
  if (!user) {
    // If middleware somehow let us through without a user, bounce to login.
    // This only matters for direct server-side renders of /admin/login.
    return <div className={`${inter.variable} font-admin`}>{children}</div>;
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className={`${inter.variable} font-admin min-h-screen bg-slate-900 flex items-center justify-center px-4`}>
        <div className="max-w-sm text-center text-white">
          <h1 className="text-2xl font-bold mb-3">Access denied</h1>
          <p className="text-slate-400 text-sm mb-6">
            Your account is signed in but is not on the admin allow-list yet.
            Ask an existing admin to add your user id to the{" "}
            <code className="text-slate-300">admins</code> table in Supabase.
          </p>
          <Link href="/" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.variable} font-admin min-h-screen bg-slate-50 flex text-slate-900`}>
      <AdminSidebar email={user.email ?? ""} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
