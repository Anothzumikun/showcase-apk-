"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { formatCount } from "@/lib/utils";

export function DownloadButton({
  appId,
  appName,
  downloadUrl,
  initialCount,
}: {
  appId: string;
  appName: string;
  downloadUrl: string | null;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleClick() {
    if (!downloadUrl) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.download_count ?? count + 1);
      }
    } catch {
      // counter gagal, tetap lanjutkan download
    } finally {
      setStatus("done");
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => setStatus("idle"), 1500);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={!downloadUrl || status === "loading"}
        className="flex w-full max-w-md items-center justify-center gap-2 rounded-xl2 bg-brand px-6 py-4 text-base font-bold text-black shadow-[0_10px_30px_-8px_theme(colors.brand.DEFAULT/50%)] transition-transform hover:scale-[1.01] hover:bg-brand-600 active:scale-[0.99] disabled:opacity-50"
      >
        {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
        {status === "done" && <CheckCircle2 className="h-5 w-5" />}
        {status === "idle" && <Download className="h-5 w-5" />}
        DOWNLOAD {appName.toUpperCase()}
      </button>
      <p className="font-mono text-xs text-slate-500">{formatCount(count)} orang sudah mengunduh</p>
    </div>
  );
}
