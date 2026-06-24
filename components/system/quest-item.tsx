"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestItemProps {
  done: boolean;
  title: string;
  subtitle?: string;
  meta?: string;
  reward?: string;
  onToggle: () => void;
}

export function QuestItem({
  done,
  title,
  subtitle,
  meta,
  reward,
  onToggle,
}: QuestItemProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group flex w-full items-start gap-3 rounded-sm border px-3 py-2.5 text-left transition-all",
        done
          ? "border-system/40 bg-system/10"
          : "border-system/15 bg-black/20 hover:border-system/40 hover:bg-system/5"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 flex-none items-center justify-center border transition-all",
          done
            ? "border-system bg-system text-black"
            : "border-system/40 text-transparent group-hover:border-system"
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>

      <span className="flex-1">
        <span
          className={cn(
            "block text-sm font-medium leading-snug transition-colors",
            done ? "text-system/70 line-through" : "text-foreground"
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>

      <span className="flex flex-none flex-col items-end gap-1">
        {meta && (
          <span className="text-[11px] font-bold text-system/90">{meta}</span>
        )}
        {reward && (
          <span className="text-[10px] text-amber-300/80">{reward}</span>
        )}
      </span>
    </button>
  );
}
