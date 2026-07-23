import { supabaseAdmin } from "@/lib/supabase";
import { formatCount } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const db = supabaseAdmin();
  const { data: apps } = await db
    .from("apps")
    .select("id, name, download_count")
    .order("download_count", { ascending: false });

  const maxCount = Math.max(1, ...(apps ?? []).map((a) => a.download_count));
  const totalDownloads = (apps ?? []).reduce((s, a) => s + a.download_count, 0);

  const { count: last7d } = await db
    .from("download_logs")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Analytics</h1>
      <p className="text-sm text-slate-500">Jumlah unduhan per aplikasi.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <Card className="p-4">
          <div className="font-display text-2xl font-bold text-white">{formatCount(totalDownloads)}</div>
          <div className="text-xs text-slate-500">Total unduhan sepanjang waktu</div>
        </Card>
        <Card className="p-4">
          <div className="font-display text-2xl font-bold text-brand">{formatCount(last7d ?? 0)}</div>
          <div className="text-xs text-slate-500">Unduhan 7 hari terakhir</div>
        </Card>
      </div>

      <Card className="mt-6 max-w-2xl p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-white">
          <TrendingUp className="h-4 w-4 text-brand" />
          Ranking Unduhan
        </h2>
        {(apps ?? []).length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada data.</p>
        ) : (
          <div className="space-y-3">
            {apps!.map((a) => (
              <div key={a.id}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-300">{a.name}</span>
                  <span className="font-mono text-slate-500">{formatCount(a.download_count)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand"
                    style={{ width: `${(a.download_count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
