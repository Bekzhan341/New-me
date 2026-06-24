"use client";

import { useState } from "react";
import { Info, Dumbbell } from "lucide-react";
import { useSystem } from "@/lib/store";
import {
  WORKOUT_DAYS,
  SCHEDULE,
  PHASES,
  WARMUP_NOTE,
  exerciseForPhase,
  scheduleForDate,
  MUSCLE_LABELS,
} from "@/lib/program";
import type { Phase } from "@/lib/types";
import { SystemWindow } from "@/components/system/system-window";
import { QuestItem } from "@/components/system/quest-item";

export default function WorkoutPage() {
  const { ready, state, today, toggleExercise, updateProfile } = useSystem();
  const [openDay, setOpenDay] = useState<"A" | "B">(() => {
    const s = scheduleForDate(new Date());
    return s.workout === "B" ? "B" : "A";
  });

  if (!ready) return null;

  const phase = state.profile.phase;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-wide text-system system-text-glow">
          ПРОТОКОЛ ТРЕНИРОВОК
        </h1>
        <p className="text-sm text-muted-foreground">
          Работа с собственным весом · цель: тело Найтвинга / Сон Джин-У
        </p>
      </header>

      {/* Warmup */}
      <div className="flex items-start gap-3 border border-system/20 bg-black/20 px-4 py-3 text-[13px] text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 flex-none text-system" />
        <p>{WARMUP_NOTE}</p>
      </div>

      {/* Phase switcher */}
      <SystemWindow title="Фаза прогрессии" tag="3 МЕСЯЦА">
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(PHASES) as Phase[]).map((p) => {
            const def = PHASES[p];
            const active = phase === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => updateProfile({ phase: p })}
                className={`border p-3 text-left transition-all ${
                  active
                    ? "border-system/50 bg-system/10"
                    : "border-system/15 bg-black/20 hover:border-system/30"
                }`}
              >
                <p className="text-[10px] uppercase tracking-widest text-system/70">
                  {def.tag}
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {def.label}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {def.goal}
                </p>
              </button>
            );
          })}
        </div>
        <ul className="mt-4 space-y-1.5 border-t border-system/15 pt-3">
          {PHASES[phase].rules.map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[13px] text-muted-foreground"
            >
              <span className="mt-1 text-system">▹</span>
              {r}
            </li>
          ))}
        </ul>
      </SystemWindow>

      {/* Weekly schedule */}
      <SystemWindow title="Расписание недели" tag="4 ТРЕНИРОВКИ">
        <div className="grid gap-1.5 sm:grid-cols-2">
          {SCHEDULE.map((s) => (
            <div
              key={s.day}
              className={`flex items-center justify-between border px-3 py-2 text-sm ${
                s.workout === "rest"
                  ? "border-system/10 bg-black/10 text-muted-foreground"
                  : "border-system/25 bg-system/5"
              }`}
            >
              <span className="font-medium text-foreground">{s.day}</span>
              <span
                className={
                  s.workout === "rest" ? "text-muted-foreground" : "text-system"
                }
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </SystemWindow>

      {/* Day tabs */}
      <div className="flex gap-2">
        {WORKOUT_DAYS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setOpenDay(d.id)}
            className={`flex-1 border px-4 py-3 text-left transition-all ${
              openDay === d.id
                ? "border-system/50 bg-system/10"
                : "border-system/15 bg-black/20 hover:border-system/30"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Dumbbell className="h-4 w-4 text-system" />
              {d.title}
            </span>
            <span className="mt-0.5 block text-[12px] text-muted-foreground">
              {d.subtitle}
            </span>
          </button>
        ))}
      </div>

      {/* Selected day exercises */}
      {WORKOUT_DAYS.filter((d) => d.id === openDay).map((d) => (
        <SystemWindow key={d.id} title={d.title} tag={PHASES[phase].tag}>
          <p className="mb-1 text-[13px] text-system/80">🎯 {d.target}</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {d.focusGroups.map((g) => (
              <span
                key={g}
                className="border border-system/30 px-2 py-0.5 text-[10px] text-system/80"
              >
                {MUSCLE_LABELS[g]}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {d.exercises.map((ex, i) => (
              <QuestItem
                key={ex.id}
                done={today.exercisesDone.includes(ex.id)}
                title={`${i + 1}. ${ex.name}`}
                subtitle={exerciseForPhase(ex, phase)}
                meta={`${ex.sets} × ${ex.reps}`}
                reward="+12 XP"
                onToggle={() => toggleExercise(ex.id)}
              />
            ))}
          </div>
        </SystemWindow>
      ))}
    </div>
  );
}
