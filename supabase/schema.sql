-- =========================================================
-- APP SHOWCASE - SUPABASE SCHEMA
-- Jalankan file ini di Supabase SQL Editor
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- ADMINS ----------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text not null default 'Admin',
  created_at timestamptz not null default now()
);

-- ---------- CATEGORIES ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- APPS ----------
create table if not exists apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,                          -- misal: "Pro Unlocked"
  description text,
  icon_url text,
  screenshots text[] not null default '{}',
  version text,
  size text,
  developer text,
  category_id uuid references categories(id) on delete set null,
  status text not null default 'published' check (status in ('draft','published','coming_soon')),
  download_url text,                     -- bisa Google Drive / Mediafire / direct link
  download_count bigint not null default 0,
  mod_info text[] not null default '{}', -- list fitur mod dengan checkmark
  requirements text,                     -- misal "Android 8.0+"
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_apps_status on apps(status);
create index if not exists idx_apps_category on apps(category_id);
create index if not exists idx_apps_slug on apps(slug);

-- ---------- APP FAQ (per-app) ----------
create table if not exists app_faqs (
  id uuid primary key default gen_random_uuid(),
  app_id uuid references apps(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order int not null default 0
);

-- ---------- GLOBAL FAQ (halaman umum) ----------
create table if not exists global_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- DOWNLOAD LOGS (untuk analytics) ----------
create table if not exists download_logs (
  id uuid primary key default gen_random_uuid(),
  app_id uuid references apps(id) on delete cascade,
  created_at timestamptz not null default now(),
  user_agent text
);

create index if not exists idx_download_logs_app on download_logs(app_id);
create index if not exists idx_download_logs_created on download_logs(created_at);

-- ---------- ATOMIC INCREMENT untuk download counter ----------
create or replace function increment_download_count(app_id_input uuid)
returns int as $$
declare
  new_count int;
begin
  update apps
  set download_count = download_count + 1
  where id = app_id_input
  returning download_count into new_count;

  return new_count;
end;
$$ language plpgsql security definer;

-- ---------- updated_at trigger ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_apps_updated_at on apps;
create trigger trg_apps_updated_at
before update on apps
for each row execute function set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- Publik hanya boleh SELECT app yang published.
-- Semua write (insert/update/delete) hanya lewat service_role
-- key di server (dipakai oleh admin panel via API route),
-- jadi tidak butuh policy insert/update untuk anon.
-- =========================================================
alter table apps enable row level security;
alter table categories enable row level security;
alter table app_faqs enable row level security;
alter table global_faqs enable row level security;
alter table download_logs enable row level security;
alter table admins enable row level security;

create policy "public read published apps"
  on apps for select
  using (status = 'published' or status = 'coming_soon');

create policy "public read categories"
  on categories for select using (true);

create policy "public read app faqs"
  on app_faqs for select using (true);

create policy "public read global faqs"
  on global_faqs for select using (true);

-- download_logs & admins: tidak ada policy select publik (default deny)
-- Admin panel mengakses semua tabel lewat SUPABASE_SERVICE_ROLE_KEY
-- di server (route handler), yang otomatis melewati RLS.

-- =========================================================
-- STORAGE BUCKETS (jalankan lewat Supabase Dashboard > Storage,
-- atau via SQL berikut jika storage extension aktif)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('app-icons', 'app-icons', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('app-screenshots', 'app-screenshots', true)
on conflict (id) do nothing;

create policy "public read app-icons"
  on storage.objects for select
  using (bucket_id = 'app-icons');

create policy "public read app-screenshots"
  on storage.objects for select
  using (bucket_id = 'app-screenshots');

-- =========================================================
-- SEED DATA CONTOH
-- =========================================================
insert into categories (name, slug, sort_order) values
  ('Aplikasi', 'aplikasi', 1),
  ('Game', 'game', 2)
on conflict (slug) do nothing;

insert into apps (
  slug, name, tagline, description, icon_url, screenshots,
  version, size, developer, category_id, status, download_url,
  download_count, mod_info, requirements, featured
) values (
  'alight-motion',
  'Alight Motion',
  'Pro Unlocked',
  'Alight Motion adalah aplikasi editor video dan animasi vektor berbasis layer, dirilis di sini sebagai build showcase pribadi developer dengan seluruh fitur premium terbuka untuk keperluan demo.',
  null,
  '{}',
  '4.5.2',
  '128 MB',
  'Showcase Dev',
  (select id from categories where slug = 'aplikasi'),
  'published',
  'https://example.com/download/alight-motion',
  128430,
  array['Semua fitur Pro terbuka','Tanpa watermark','Export tanpa batas','Akses semua stiker & font premium'],
  'Android 8.0+',
  true
)
on conflict (slug) do nothing;
