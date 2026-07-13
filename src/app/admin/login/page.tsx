import { Inter } from "next/font/google";
import LoginForm from "@/components/admin/LoginForm";

const inter = Inter({ subsets: ["latin"], variable: "--font-admin" });

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className={`${inter.variable} font-admin min-h-screen bg-slate-900 flex items-center justify-center px-4`}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
            ज
          </div>
          <span className="text-white font-semibold text-lg">Jagsamvad</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-lg font-semibold text-slate-900 text-center">Sign in to admin</h1>
          <p className="text-sm text-slate-500 text-center mt-1 mb-6">
            Manage articles, categories and authors.
          </p>
          <LoginForm next={next || "/admin"} />
        </div>
      </div>
    </div>
  );
}
