import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { AppsTable } from "@/components/admin/apps-table";

export const dynamic = "force-dynamic";

export default async function AdminAppsPage() {
  const db = supabaseAdmin();
  const { data: apps } = await db
    .from("apps")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Kelola Aplikasi</h1>
          <p className="text-sm text-slate-500">{apps?.length ?? 0} aplikasi terdaftar.</p>
        </div>
        <Button asChild>
          <Link href="/admin/apps/new">
            <Plus className="h-4 w-4" />
            Tambah
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <AppsTable apps={apps ?? []} />
      </div>
    </div>
  );
}
