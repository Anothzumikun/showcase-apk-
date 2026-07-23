"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Layers } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : "/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-base/80 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/30">
            <Layers className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Showcase<span className="text-brand">.</span>
          </span>
        </Link>

        <form onSubmit={onSubmit} className="relative ml-auto w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari aplikasi atau game…"
            className="h-10 w-full rounded-full border border-surface-border bg-surface-raised pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </form>

        <nav className="hidden shrink-0 items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <Link href="/" className="hover:text-brand">Beranda</Link>
          <Link href="/#kategori" className="hover:text-brand">Kategori</Link>
          <Link href="/faq" className="hover:text-brand">FAQ</Link>
        </nav>
      </div>
    </header>
  );
}
