"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, Package } from "lucide-react";
import { AppItem } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusLabel: Record<string, { text: string; variant: "default" | "outline" | "soft" }> = {
  published: { text: "Published", variant: "default" },
  draft: { text: "Draft", variant: "outline" },
  coming_soon: { text: "Segera Hadir", variant: "soft" },
};

export function AppsTable({ apps }: { apps: AppItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/apps/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("Gagal menghapus aplikasi.");
    } finally {
      setDeletingId(null);
    }
  }

  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl2 border border-dashed border-surface-border py-16 text-center">
        <Package className="h-8 w-8 text-slate-600" />
        <p className="text-sm text-slate-500">Belum ada aplikasi. Klik &ldquo;Tambah&rdquo; untuk mulai.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl2 border border-surface-border">
      <table className="w-full text-sm">
        <thead className="bg-surface-raised text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Aplikasi</th>
            <th className="hidden px-4 py-3 sm:table-cell">Kategori</th>
            <th className="hidden px-4 py-3 sm:table-cell">Unduhan</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {apps.map((app) => (
            <tr key={app.id} className="bg-surface/40">
              <td className="px-4 py-3">
                <div className="font-medium text-white">{app.name}</div>
                <div className="text-xs text-slate-500">v{app.version ?? "-"}</div>
              </td>
              <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">
                {app.category?.name ?? "-"}
              </td>
              <td className="hidden px-4 py-3 font-mono text-xs text-slate-400 sm:table-cell">
                {formatCount(app.download_count)}
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusLabel[app.status]?.variant ?? "outline"}>
                  {statusLabel[app.status]?.text ?? app.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="icon">
                    <Link href={`/admin/apps/${app.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(app.id, app.name)}
                    disabled={deletingId === app.id}
                  >
                    {deletingId === app.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
