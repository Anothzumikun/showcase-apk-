"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUploader, ScreenshotsUploader } from "@/components/admin/image-uploader";
import { ListFieldEditor, FaqListEditor, FaqDraft } from "@/components/admin/list-field-editor";
import { Category, AppStatus } from "@/lib/types";

export interface AppFormValues {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon_url: string | null;
  screenshots: string[];
  version: string;
  size: string;
  developer: string;
  category_id: string;
  status: AppStatus;
  download_url: string;
  mod_info: string[];
  requirements: string;
  featured: boolean;
  faqs: FaqDraft[];
}

const emptyValues: AppFormValues = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  icon_url: null,
  screenshots: [],
  version: "",
  size: "",
  developer: "",
  category_id: "",
  status: "draft",
  download_url: "",
  mod_info: [],
  requirements: "",
  featured: false,
  faqs: [],
};

export function AppForm({
  categories,
  initialValues,
}: {
  categories: Category[];
  initialValues?: AppFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<AppFormValues>(initialValues ?? emptyValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(values.id);

  function set<K extends keyof AppFormValues>(key: K, val: AppFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/admin/apps/${values.id}` : "/api/admin/apps";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Gagal menyimpan");
      }
      router.push("/admin/apps");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nama Aplikasi</Label>
              <Input required value={values.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input
                value={values.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="dibuat otomatis dari nama jika kosong"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tagline (misal: &quot;Pro Unlocked&quot;)</Label>
            <Input value={values.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Deskripsi</Label>
            <Textarea value={values.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Icon Aplikasi</Label>
            <IconUploader value={values.icon_url} onChange={(url) => set("icon_url", url)} />
          </div>

          <div className="space-y-1.5">
            <Label>Screenshot</Label>
            <ScreenshotsUploader
              value={values.screenshots}
              onChange={(urls) => set("screenshots", urls)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detail &amp; Kategori</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Versi</Label>
              <Input value={values.version} onChange={(e) => set("version", e.target.value)} placeholder="1.0.0" />
            </div>
            <div className="space-y-1.5">
              <Label>Ukuran</Label>
              <Input value={values.size} onChange={(e) => set("size", e.target.value)} placeholder="45 MB" />
            </div>
            <div className="space-y-1.5">
              <Label>Developer</Label>
              <Input value={values.developer} onChange={(e) => set("developer", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select
                value={values.category_id}
                onChange={(e) => set("category_id", e.target.value)}
              >
                <option value="">Tanpa kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={values.status} onChange={(e) => set("status", e.target.value as AppStatus)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="coming_soon">Segera Hadir</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Persyaratan</Label>
              <Input
                value={values.requirements}
                onChange={(e) => set("requirements", e.target.value)}
                placeholder="Android 8.0+"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Link Download (Google Drive / MediaFire / Direct)</Label>
            <Input
              value={values.download_url}
              onChange={(e) => set("download_url", e.target.value)}
              placeholder="https://drive.google.com/..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 rounded border-surface-border accent-brand"
            />
            Tampilkan sebagai unggulan (featured)
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <ListFieldEditor
            label="Info Mod / Fitur"
            items={values.mod_info}
            onChange={(items) => set("mod_info", items)}
            placeholder="misal: Semua fitur Pro terbuka"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <FaqListEditor items={values.faqs} onChange={(items) => set("faqs", items)} />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-border bg-surface/95 p-4 backdrop-blur-md md:sticky md:bottom-4 md:rounded-xl2 md:border">
        <div className="mx-auto flex max-w-3xl justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan
          </Button>
        </div>
      </div>
    </form>
  );
}
