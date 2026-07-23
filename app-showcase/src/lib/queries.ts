import { supabasePublic } from "@/lib/supabase";
import { AppItem, Category, AppFaq, GlobalFaq } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabasePublic
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getApps(params?: { cat?: string; q?: string }): Promise<AppItem[]> {
  let query = supabasePublic
    .from("apps")
    .select("*, category:categories(*)")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (params?.cat === "coming_soon") {
    query = query.eq("status", "coming_soon");
  } else if (params?.cat && params.cat !== "semua") {
    const { data: cat } = await supabasePublic
      .from("categories")
      .select("id")
      .eq("slug", params.cat)
      .single();
    if (cat) query = query.eq("category_id", cat.id).eq("status", "published");
  } else {
    query = query.in("status", ["published", "coming_soon"]);
  }

  if (params?.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as AppItem[];
}

export async function getAppBySlug(slug: string): Promise<AppItem | null> {
  const { data, error } = await supabasePublic
    .from("apps")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as unknown as AppItem;
}

export async function getAppFaqs(appId: string): Promise<AppFaq[]> {
  const { data, error } = await supabasePublic
    .from("app_faqs")
    .select("*")
    .eq("app_id", appId)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data;
}

export async function getGlobalFaqs(): Promise<GlobalFaq[]> {
  const { data, error } = await supabasePublic
    .from("global_faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data;
}
