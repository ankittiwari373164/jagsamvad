"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, FolderOpen, Users, LogOut, ExternalLink } from "lucide-react";
import { logout } from "@/app/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/authors", label: "Authors", icon: Users },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      <div className="p-5 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
          ज
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">Jagsamvad</p>
          <p className="text-[11px] text-slate-400 leading-tight">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((l) => {
          const Icon = l.icon;
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors px-1"
        >
          <ExternalLink size={13} />
          View site
        </Link>
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500 truncate">{email}</p>
          <form action={logout}>
            <button
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors shrink-0"
              aria-label="Sign out"
            >
              <LogOut size={13} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
