import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { appId } = await req.json();
  if (!appId) {
    return NextResponse.json({ error: "appId wajib diisi" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Naikkan counter secara atomik lewat fungsi Postgres (menghindari race condition).
  const { data: nextCount, error: rpcError } = await db.rpc("increment_download_count", {
    app_id_input: appId,
  });

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  await db.from("download_logs").insert({
    app_id: appId,
    user_agent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({ download_count: nextCount });
}
