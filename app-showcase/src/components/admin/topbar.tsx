"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, ExternalLink, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/apps", label: "Aplikasi" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminTopbar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 border-b border-surface-border bg-base/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 md:hidden">
          <Menu className="h-4 w-4" />
          Admin
        </div>
        <span className="hidden text-sm text-slate-400 md:block">
          Masuk sebagai <span className="text-white">{userName}</span>
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-surface-raised"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lihat Situs</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
      <div className="scrollbar-none flex gap-1 overflow-x-auto border-t border-surface-border px-4 py-2 md:hidden">
        {mobileLinks.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                active ? "border-brand text-brand" : "border-surface-border text-slate-400"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
