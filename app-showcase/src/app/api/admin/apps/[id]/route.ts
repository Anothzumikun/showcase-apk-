import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  const { data: app, error } = await db
    .from("apps")
    .select("*, category:categories(*)")
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: faqs } = await db
    .from("app_faqs")
    .select("*")
    .eq("app_id", params.id)
    .order("sort_order", { ascending: true });

  return NextResponse.json({ data: { ...app, faqs: faqs ?? [] } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = supabaseAdmin();

  const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);

  const { data, error } = await db
    .from("apps")
    .update({
      slug,
      name: body.name,
      tagline: body.tagline || null,
      description: body.description || null,
      icon_url: body.icon_url || null,
      screenshots: body.screenshots || [],
      version: body.version || null,
      size: body.size || null,
      developer: body.developer || null,
      category_id: body.category_id || null,
      status: body.status || "draft",
      download_url: body.download_url || null,
      mod_info: body.mod_info || [],
      requirements: body.requirements || null,
      featured: !!body.featured,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Replace semua FAQ app ini
  await db.from("app_faqs").delete().eq("app_id", params.id);
  if (Array.isArray(body.faqs) && body.faqs.length > 0) {
    const rows = body.faqs.map((f: { question: string; answer: string }, i: number) => ({
      app_id: params.id,
      question: f.question,
      answer: f.answer,
      sort_order: i,
    }));
    await db.from("app_faqs").insert(rows);
  }

  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  const { error } = await db.from("apps").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
