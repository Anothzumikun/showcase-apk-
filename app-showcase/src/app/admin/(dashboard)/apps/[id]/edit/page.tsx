import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { AppForm, AppFormValues } from "@/components/admin/app-form";

export const dynamic = "force-dynamic";

export default async function EditAppPage({ params }: { params: { id: string } }) {
  const db = supabaseAdmin();

  const [{ data: app }, { data: categories }, { data: faqs }] = await Promise.all([
    db.from("apps").select("*").eq("id", params.id).single(),
    db.from("categories").select("*").order("sort_order"),
    db.from("app_faqs").select("*").eq("app_id", params.id).order("sort_order"),
  ]);

  if (!app) notFound();

  const initialValues: AppFormValues = {
    id: app.id,
    name: app.name,
    slug: app.slug,
    tagline: app.tagline ?? "",
    description: app.description ?? "",
    icon_url: app.icon_url,
    screenshots: app.screenshots ?? [],
    version: app.version ?? "",
    size: app.size ?? "",
    developer: app.developer ?? "",
    category_id: app.category_id ?? "",
    status: app.status,
    download_url: app.download_url ?? "",
    mod_info: app.mod_info ?? [],
    requirements: app.requirements ?? "",
    featured: app.featured,
    faqs: (faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Edit Aplikasi</h1>
      <p className="mb-6 text-sm text-slate-500">{app.name}</p>
      <div className="max-w-3xl">
        <AppForm categories={categories ?? []} initialValues={initialValues} />
      </div>
    </div>
  );
}
