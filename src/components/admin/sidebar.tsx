"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageCircleQuestion,
  BarChart3,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/apps", label: "Aplikasi", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/faq", label: "FAQ Global", icon: MessageCircleQuestion },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-surface-border bg-surface/60 md:block">
      <div className="flex h-16 items-center gap-2 border-b border-surface-border px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/30">
          <Layers className="h-4 w-4" />
        </span>
        <span className="font-display text-sm font-bold text-white">Showcase Admin</span>
      </div>
      <nav className="space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-surface-raised hover:text-white",
                active && "bg-brand/10 text-brand"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
