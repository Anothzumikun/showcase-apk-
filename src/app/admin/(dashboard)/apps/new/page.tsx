import { supabaseAdmin } from "@/lib/supabase";
import { AppForm } from "@/components/admin/app-form";

export const dynamic = "force-dynamic";

export default async function NewAppPage() {
  const db = supabaseAdmin();
  const { data: categories } = await db.from("categories").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Tambah Aplikasi</h1>
      <p className="mb-6 text-sm text-slate-500">Isi detail rilis baru di bawah ini.</p>
      <div className="max-w-3xl">
        <AppForm categories={categories ?? []} />
      </div>
    </div>
  );
}
