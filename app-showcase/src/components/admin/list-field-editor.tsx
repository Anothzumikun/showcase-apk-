"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ListFieldEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  function update(i: number, val: string) {
    const next = [...items];
    next[i] = val;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, ""]);
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 text-slate-600" />
            <Input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Tambah Item
        </Button>
      </div>
    </div>
  );
}

export interface FaqDraft {
  question: string;
  answer: string;
}

export function FaqListEditor({
  items,
  onChange,
}: {
  items: FaqDraft[];
  onChange: (items: FaqDraft[]) => void;
}) {
  function update(i: number, key: keyof FaqDraft, val: string) {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { question: "", answer: "" }]);
  }

  return (
    <div>
      <Label>FAQ Aplikasi</Label>
      <div className="mt-2 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-surface-border p-3">
            <div className="flex items-center gap-2">
              <Input
                value={item.question}
                onChange={(e) => update(i, "question", e.target.value)}
                placeholder="Pertanyaan"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
            <Textarea
              value={item.answer}
              onChange={(e) => update(i, "answer", e.target.value)}
              placeholder="Jawaban"
              className="min-h-[70px]"
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Tambah FAQ
        </Button>
      </div>
    </div>
  );
}
