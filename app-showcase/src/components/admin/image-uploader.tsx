"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

async function uploadFile(file: File, bucket: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload gagal");
  const data = await res.json();
  return data.url as string;
}

export function IconUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, "app-icons");
      onChange(url);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-surface-border bg-surface-raised">
        {value && <Image src={value} alt="icon" fill sizes="64px" className="object-cover" />}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-4 w-4 animate-spin text-brand" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" />
          {value ? "Ganti Icon" : "Unggah Icon"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </div>
  );
}

export function ScreenshotsUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setLoading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, "app-screenshots")));
      onChange([...value, ...urls]);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url + i} className="relative h-24 w-14 overflow-hidden rounded-lg border border-surface-border">
            <Image src={url} alt="" fill sizes="56px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex h-24 w-14 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-surface-border text-slate-500 hover:border-brand hover:text-brand"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span className="text-[10px]">Tambah</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
    </div>
  );
}
