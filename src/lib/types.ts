export type AppStatus = "draft" | "published" | "coming_soon";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface AppItem {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon_url: string | null;
  screenshots: string[];
  version: string | null;
  size: string | null;
  developer: string | null;
  category_id: string | null;
  status: AppStatus;
  download_url: string | null;
  download_count: number;
  mod_info: string[];
  requirements: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface AppFaq {
  id: string;
  app_id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface GlobalFaq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}
