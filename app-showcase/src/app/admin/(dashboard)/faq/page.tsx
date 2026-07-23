"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2, Save, X } from "lucide-react";
import { GlobalFaq } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function GlobalFaqPage() {
  const [faqs, setFaqs] = useState<GlobalFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/global-faqs");
    const data = await res.json();
    setFaqs(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(f: GlobalFaq) {
    setEditingId(f.id);
    setForm({ question: f.question, answer: f.answer, sort_order: f.sort_order });
  }
  function startNew() {
    setEditingId("new");
    setForm({ question: "", answer: "", sort_order: faqs.length });
  }
  function cancel() {
    setEditingId(null);
    setForm({ question: "", answer: "", sort_order: 0 });
  }

  async function save() {
    setSaving(true);
    try {
      const url = editingId === "new" ? "/api/admin/global-faqs" : `/api/admin/global-faqs/${editingId}`;
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
      alert("Gagal menyimpan FAQ.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Hapus FAQ ini?")) return;
    const res = await fetch(`/api/admin/global-faqs/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">FAQ Global</h1>
          <p className="text-sm text-slate-500">Ditampilkan di halaman /faq.</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="mt-6 max-w-2xl space-y-3">
        {editingId === "new" && (
          <FaqFormCard form={form} setForm={setForm} onSave={save} onCancel={cancel} saving={saving} />
        )}

        {loading ? (
          <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin text-slate-500" />
        ) : (
          faqs.map((f) =>
            editingId === f.id ? (
              <FaqFormCard key={f.id} form={form} setForm={setForm} onSave={save} onCancel={cancel} saving={saving} />
            ) : (
              <Card key={f.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{f.question}</div>
                    <p className="mt-1 text-sm text-slate-400">{f.answer}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEdit(f)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => remove(f.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          )
        )}

        {!loading && faqs.length === 0 && editingId !== "new" && (
          <p className="text-sm text-slate-500">Belum ada FAQ.</p>
        )}
      </div>
    </div>
  );
}

function FaqFormCard({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
}: {
  form: { question: string; answer: string; sort_order: number };
  setForm: (f: { question: string; answer: string; sort_order: number }) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        <div className="space-y-1.5">
          <Label>Pertanyaan</Label>
          <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Jawaban</Label>
          <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
          <Button size="sm" onClick={onSave} disabled={saving || !form.question || !form.answer}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Simpan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
