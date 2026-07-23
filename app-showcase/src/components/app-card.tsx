import Link from "next/link";
import Image from "next/image";
import { Download, Package } from "lucide-react";
import { AppItem } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function AppCard({ app }: { app: AppItem }) {
  const isComingSoon = app.status === "coming_soon";

  return (
    <Link
      href={isComingSoon ? "#" : `/app/${app.slug}`}
      className={`group relative flex flex-col rounded-xl2 border border-surface-border bg-surface/70 p-4 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_0_0_1px_theme(colors.brand.DEFAULT/30%),0_8px_24px_-8px_theme(colors.brand.DEFAULT/25%)] ${
        isComingSoon ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-surface-border bg-surface-raised">
          {app.icon_url ? (
            <Image src={app.icon_url} alt={app.name} fill sizes="56px" className="object-cover" />
          ) : (
            <Package className="h-6 w-6 text-slate-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-sm font-semibold text-white">{app.name}</h3>
          {app.tagline && (
            <Badge variant="soft" className="mt-1">
              {app.tagline}
            </Badge>
          )}
          <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
            <Download className="h-3 w-3" />
            {formatCount(app.download_count)} unduhan
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[11px] text-slate-500">v{app.version ?? "-"}</span>
        {isComingSoon ? (
          <span className="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-semibold text-slate-400">
            Segera Hadir
          </span>
        ) : (
          <span className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-black transition-colors group-hover:bg-brand-600">
            Download
          </span>
        )}
      </div>
    </Link>
  );
}
