"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/types";

export function CategoryTabs({ categories }: { categories: Category[] }) {
  const params = useSearchParams();
  const active = params.get("cat") ?? "semua";

  const tabs = [
    { slug: "semua", name: "Semua" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
    { slug: "coming_soon", name: "Segera Hadir" },
  ];

  return (
    <div id="kategori" className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {tabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.slug === "semua" ? "/" : `/?cat=${tab.slug}`}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            active === tab.slug
              ? "border-brand bg-brand/10 text-brand"
              : "border-surface-border text-slate-400 hover:border-brand/30 hover:text-white"
          )}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
