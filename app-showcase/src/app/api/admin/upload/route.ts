import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "node:crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string) || "app-icons";

  if (!file) return NextResponse.json({ error: "File wajib diunggah" }, { status: 400 });
  if (!["app-icons", "app-screenshots"].includes(bucket)) {
    return NextResponse.json({ error: "Bucket tidak valid" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const ext = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage.from(bucket).upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: publicUrl } = db.storage.from(bucket).getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl.publicUrl });
}
