import { ShieldCheck, Download, Sparkles } from "lucide-react";

export function Hero({ totalApps, totalDownloads }: { totalApps: number; totalDownloads: string }) {
  return (
    <section className="relative overflow-hidden bg-hero-grid pb-14 pt-14 md:pt-20">
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand-200">
            <Sparkles className="h-3.5 w-3.5" />
            Dibangun &amp; dirilis langsung oleh developer
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Aplikasi &amp; game buatan sendiri,
            <br className="hidden sm:block" /> <span className="text-gradient">siap diunduh</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400 sm:text-base">
            Semua rilis di halaman ini dikembangkan, ditandatangani, dan didistribusikan langsung oleh pembuatnya. Tidak ada modifikasi pihak ketiga.
          </p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
            <Stat icon={<LayoutStat />} value={String(totalApps)} label="Rilis" />
            <Stat icon={<Download className="h-4 w-4" />} value={totalDownloads} label="Unduhan" />
            <Stat icon={<ShieldCheck className="h-4 w-4" />} value="100%" label="Resmi" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LayoutStat() {
  return <Sparkles className="h-4 w-4" />;
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl2 border border-surface-border bg-surface/60 px-3 py-4 backdrop-blur-sm">
      <div className="mb-1 flex items-center justify-center text-brand">{icon}</div>
      <div className="font-mono text-lg font-bold text-white">{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}
