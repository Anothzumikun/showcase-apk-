import Link from "next/link";
import { Package, Download, FolderTree, Clock, Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { formatCount } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getStats() {
  const db = supabaseAdmin();

  const [{ count: totalApps }, { count: totalCategories }, { data: apps }] = await Promise.all([
    db.from("apps").select("*", { count: "exact", head: true }),
    db.from("categories").select("*", { count: "exact", head: true }),
    db.from("apps").select("download_count, name, updated_at").order("updated_at", { ascending: false }).limit(5),
  ]);

  const totalDownloads = (apps ?? []).reduce((s, a) => s + a.download_count, 0);
  const { data: allApps } = await db.from("apps").select("download_count");
  const grandTotalDownloads = (allApps ?? []).reduce((s, a) => s + a.download_count, 0);

  return {
    totalApps: totalApps ?? 0,
    totalCategories: totalCategories ?? 0,
    totalDownloads: grandTotalDownloads,
    recent: apps ?? [],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-500">Ringkasan konten Showcase.</p>
        </div>
        <Button asChild>
          <Link href="/admin/apps/new">
            <Plus className="h-4 w-4" />
            Tambah Aplikasi
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<Package className="h-5 w-5" />} label="Total Aplikasi" value={String(stats.totalApps)} />
        <StatCard icon={<Download className="h-5 w-5" />} label="Total Unduhan" value={formatCount(stats.totalDownloads)} />
        <StatCard icon={<FolderTree className="h-5 w-5" />} label="Kategori" value={String(stats.totalCategories)} />
      </div>

      <div className="mt-8 rounded-xl2 border border-surface-border bg-surface/60 p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-white">
          <Clock className="h-4 w-4 text-brand" />
          Baru Diperbarui
        </h2>
        {stats.recent.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada aplikasi.</p>
        ) : (
          <ul className="divide-y divide-surface-border">
            {stats.recent.map((a, i) => (
              <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-slate-300">{a.name}</span>
                <span className="font-mono text-xs text-slate-500">{formatCount(a.download_count)} unduhan</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl2 border border-surface-border bg-surface/60 p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
        {icon}
      </div>
      <div className="font-display text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
