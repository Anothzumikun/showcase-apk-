# Showcase — Direktori Aplikasi & Game Buatan Sendiri

Website direktori untuk mempublikasikan aplikasi/game yang **kamu kembangkan sendiri**, lengkap dengan halaman detail, admin panel CRUD, sistem hitung unduhan, dan tema dark/hijau modern.

> Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style components · Supabase (Postgres + Storage) · NextAuth (Credentials)

## 1. Struktur Folder

```
src/
  app/
    layout.tsx, page.tsx          -> Landing page publik
    app/[slug]/page.tsx           -> Halaman detail aplikasi (dinamis)
    faq/page.tsx                  -> FAQ global
    search/page.tsx               -> Halaman pencarian (mobile bottom nav)
    admin/
      login/page.tsx              -> Login admin
      (dashboard)/                -> Route group, semua butuh auth
        page.tsx                  -> Dashboard/statistik
        apps/page.tsx             -> List aplikasi
        apps/new/page.tsx         -> Tambah aplikasi
        apps/[id]/edit/page.tsx   -> Edit aplikasi
        categories/page.tsx       -> Kelola kategori
        faq/page.tsx              -> Kelola FAQ global
        analytics/page.tsx        -> Statistik unduhan
    api/
      auth/[...nextauth]/route.ts -> NextAuth handler
      download/route.ts           -> Increment counter unduhan (publik)
      admin/                      -> Semua endpoint CRUD (dilindungi auth)
  components/
    ui/                           -> Button, Card, Input, Accordion, dst
    admin/                        -> Sidebar, form, tabel, uploader gambar
  lib/
    supabase.ts, auth.ts, types.ts, queries.ts, utils.ts
  middleware.ts                   -> Proteksi /admin/* & /api/admin/*
supabase/
  schema.sql                      -> Jalankan di Supabase SQL Editor
scripts/
  create-admin.mjs                -> Generator hash password admin pertama
```

## 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, tempel isi `supabase/schema.sql`, lalu jalankan. Ini akan membuat semua tabel, RLS policy, storage bucket (`app-icons`, `app-screenshots`), dan 1 baris contoh data.
3. Buka **Project Settings > API**, salin:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ rahasia, jangan pernah expose ke client)

## 3. Buat Akun Admin Pertama

Karena tidak ada halaman "register" (admin panel privat), buat admin lewat script:

```bash
node scripts/create-admin.mjs "admin@kamu.com" "password-kuat" "Nama Kamu"
```

Script akan mencetak perintah `INSERT` — jalankan hasilnya di Supabase SQL Editor. Setelah itu kamu bisa login di `/admin/login`.

## 4. Environment Variables

Salin `.env.example` menjadi `.env.local` lalu isi:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...   # generate: openssl rand -base64 32
```

## 5. Jalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` untuk situs publik, dan `http://localhost:3000/admin/login` untuk admin panel.

## 6. Alur Kerja Admin

1. Login di `/admin/login`.
2. **Kategori** — buat kategori (misal "Aplikasi", "Game") sebelum menambah aplikasi.
3. **Aplikasi > Tambah** — isi nama, upload icon & screenshot, isi versi/ukuran/developer, pilih status (`draft` / `published` / `coming_soon`), isi daftar "Info Mod/Fitur", tambahkan FAQ khusus aplikasi, dan isi link unduhan (Google Drive, MediaFire, atau direct link).
4. Aplikasi berstatus `published` langsung tampil di beranda; `coming_soon` masuk tab "Segera Hadir"; `draft` disembunyikan dari publik.
5. **FAQ Global** untuk halaman `/faq`.
6. **Analytics** menampilkan ranking unduhan per aplikasi & total unduhan 7 hari terakhir.

## 7. Catatan Keamanan

- Semua endpoint di `/api/admin/*` memverifikasi sesi NextAuth di server sebelum mengizinkan operasi tulis, dan juga dilindungi lapis tambahan oleh `middleware.ts`.
- Tabel publik dilindungi Row Level Security: publik hanya bisa `SELECT` aplikasi berstatus `published`/`coming_soon`; semua operasi tulis wajib lewat `service_role` key di server.
- `SUPABASE_SERVICE_ROLE_KEY` **tidak boleh** pernah dikirim ke browser — hanya dipakai di route handler (`src/lib/supabase.ts` fungsi `supabaseAdmin()`).

## 8. Deploy

Cara termudah: deploy ke [Vercel](https://vercel.com), lalu tambahkan environment variables yang sama seperti `.env.local` di dashboard Vercel (set `NEXTAUTH_URL` ke domain produksi).

## 9. Kustomisasi Tema

Warna aksen hijau (`#22c55e`) dan background dark (`#05070d` / `#0d1420`) diatur terpusat di `tailwind.config.ts` pada key `colors.brand` dan `colors.base`/`colors.surface`. Ganti nilai hex di sana untuk reskin cepat ke tema lain.
