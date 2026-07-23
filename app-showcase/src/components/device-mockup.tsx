"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DeviceMockup({ screenshots, appName }: { screenshots: string[]; appName: string }) {
  const [active, setActive] = useState(0);

  if (screenshots.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto w-[240px] rounded-[2.2rem] border-[8px] border-[#1a2436] bg-[#1a2436] shadow-[0_0_0_2px_#22c55e33,0_20px_60px_-20px_rgba(0,0,0,.6)]">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-[#1a2436]" />
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.6rem] bg-surface-raised">
          <Image
            src={screenshots[active]}
            alt={`Screenshot ${appName} ${active + 1}`}
            fill
            sizes="240px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 animate-scan bg-scan-line opacity-40" />
        </div>
      </div>

      {screenshots.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {screenshots.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-14 w-8 shrink-0 overflow-hidden rounded-md border transition-all",
                active === i ? "border-brand ring-1 ring-brand" : "border-surface-border opacity-60"
              )}
            >
              <Image src={src} alt="" fill sizes="32px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
