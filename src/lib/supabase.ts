import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Client untuk dipakai di sisi publik (browser / server components untuk baca data).
 * Terikat oleh Row Level Security -> hanya bisa baca data published.
 */
export const supabasePublic = createClient(url, anonKey, {
  auth: { persistSession: false },
});

/**
 * Client admin (service role) — HANYA dipakai di route handler / server action.
 * Melewati RLS sepenuhnya, jangan pernah diimpor ke client component.
 */
export function supabaseAdmin() {
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diset di .env");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
