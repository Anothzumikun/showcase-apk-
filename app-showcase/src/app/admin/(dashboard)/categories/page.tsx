"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2, Save, X } from "lucide-react";
import { Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(c: Category) {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, sort_order: c.sort_order });
  }

  function startNew() {
    setEditingId("new");
    setForm({ name: "", slug: "", sort_order: categories.length });
  }

  function cancel() {
    setEditingId(null);
    setForm({ name: "", slug: "", sort_order: 0 });
  }

  async function save() {
    setSaving(true);
    try {
      const url = editingId === "new" ? "/api/admin/categories" : `/api/admin/categories/${editingId}`;
      const method = editingId === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      cancel();
      load();
    } catch {
      alert("Gagal menyimpan kategori.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Hapus kategori ini? Aplikasi terkait tidak akan terhapus.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Kategori</h1>
          <p className="text-sm text-slate-500">Kelola kategori aplikasi &amp; game.</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="mt-6 max-w-xl space-y-3">
        {editingId === "new" && (
          <CategoryFormCard form={form} setForm={setForm} onSave={save} onCancel={cancel} saving={saving} />
        )}

        {loading ? (
          <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin text-slate-500" />
        ) : (
          categories.map((c) =>
            editingId === c.id ? (
              <CategoryFormCard
                key={c.id}
                form={form}
                setForm={setForm}
                onSave={save}
                onCancel={cancel}
                saving={saving}
              />
            ) : (
              <Card key={c.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-white">{c.name}</div>
                  <div className="text-xs text-slate-500">/{c.slug}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => startEdit(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => remove(c.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              </Card>
            )
          )
        )}

        {!loading && categories.length === 0 && editingId !== "new" && (
          <p className="text-sm text-slate-500">Belum ada kategori.</p>
        )}
      </div>
    </div>
  );
}

function CategoryFormCard({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
}: {
  form: { name: string; slug: string; sort_order: number };
  setForm: (f: { name: string; slug: string; sort_order: number }) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        <div className="space-y-1.5">
          <Label>Nama Kategori</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="otomatis jika kosong"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
          <Button size="sm" onClick={onSave} disabled={saving || !form.name}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Simpan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
