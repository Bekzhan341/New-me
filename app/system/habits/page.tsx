"use client";

import {
  Sunrise,
  BookOpen,
  Droplet,
  Ban,
  Moon,
  StretchHorizontal,
  Snowflake,
  type LucideIcon,
} from "lucide-react";
import { useSystem } from "@/lib/store";
import { HABITS, STATS } from "@/lib/program";
import { SystemWindow } from "@/components/system/system-window";

const ICONS: Record<string, LucideIcon> = {
  Sunrise,
  BookOpen,
  Droplet,
  Ban,
  Moon,
  StretchHorizontal,
  Snowflake,
};

export default function HabitsPage() {
  const { ready, today, toggleHabit, derived } = useSystem();
  if (!ready) return null;

  const doneCount = HABITS.filter((h) => today.habitsDone.includes(h.id)).length;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-wide text-system system-text-glow">
          КОДЕКС ОХОТНИКА
        </h1>
        <p className="text-sm text-muted-foreground">
          Дисциплина — фундамент силы. Привычки прокачивают характеристики.
        </p>
      </header>

      <SystemWindow title="Привычки дня" tag={`${doneCount} / ${HABITS.length}`}>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {HABITS.map((h) => {
            const Icon = ICONS[h.icon] ?? BookOpen;
            const done = today.habitsDone.includes(h.id);
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => toggleHabit(h.id)}
                className={`flex items-center gap-3 border px-4 py-3 text-left transition-all ${
                  done
                    ? "border-system/40 bg-system/10"
                    : "border-system/15 bg-black/20 hover:border-system/30"
                }`}
              >
                <span
                  className={`flex h-10 w-10 flex-none items-center justify-center border ${
                    done
                      ? "border-system bg-system/20 text-system"
                      : "border-system/30 text-system/60"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-foreground">
                    {h.title}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {h.description}
                  </span>
                </span>
                <span className="flex flex-none flex-col items-end">
                  <span className="text-[11px] font-bold text-system">
                    {h.stat}
                  </span>
                  <span className="text-[10px] text-amber-300/80">
                    +{h.xp} XP
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </SystemWindow>

      <SystemWindow title="Влияние на характеристики" tag="STATUS">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {STATS.map((s) => (
            <div
              key={s.key}
              className="border border-system/15 bg-black/20 p-3 text-center"
            >
              <p className="text-lg font-bold text-system">
                {derived.stats[s.key]}
              </p>
              <p className="text-[11px] font-bold text-foreground">{s.label}</p>
              <p className="text-[9px] text-muted-foreground">{s.ru}</p>
            </div>
          ))}
        </div>
      </SystemWindow>
    </div>
  );
}
