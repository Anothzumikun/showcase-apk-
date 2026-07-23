import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outline" | "soft" }) {
  const styles = {
    default: "bg-brand text-black",
    outline: "border border-surface-border text-slate-300",
    soft: "bg-brand/10 text-brand-400 border border-brand/20",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles,
        className
      )}
      {...props}
    />
  );
}
