"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, LayoutGrid, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#unggulan", label: "Features", icon: Sparkles },
  { href: "/#kategori", label: "Pages", icon: LayoutGrid },
  { href: "/search", label: "Search", icon: Search },
  { href: "/faq", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-border bg-surface/95 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]) && href !== "/";
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-slate-500",
                active && "text-brand"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
