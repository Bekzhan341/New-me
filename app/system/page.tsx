"use client";

import Link from "next/link";
import {
  Flame,
  Droplet,
  Minus,
  Plus,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useSystem } from "@/lib/store";
import {
  HABITS,
  STATS,
  WORKOUT_DAYS,
  PHASES,
  scheduleForDate,
  MUSCLE_LABELS,
} from "@/lib/program";
import { SystemWindow } from "@/components/system/system-window";
import { QuestItem } from "@/components/system/quest-item";
import { XpBar } from "@/components/system/xp-bar";

export default function DashboardPage() {
  const {
    ready,
    state,
    derived,
    today,
    toggleHabit,
    setWater,
  } = useSystem();

  if (!ready) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-system/60">
        <span className="animate-system-pulse tracking-widest">
          ЗАГРУЗКА СИСТЕМЫ…
        </span>
      </div>
    );
  }

  const { profile } = state;
  const phase = PHASES[profile.phase];
  const sched = scheduleForDate(new Date());
  const todayWorkout =
    sched.workout !== "rest"
      ? WORKOUT_DAYS.find((d) => d.id === sched.workout)
      : null;

  const exercisesDoneToday = todayWorkout
    ? todayWorkout.exercises.filter((e) => today.exercisesDone.includes(e.id))
        .length
    : 0;

  return (
    <div className="space-y-5">
      {/* Onboarding nudge */}
      {!profile.onboarded && (
        <Link
          href="/onboarding"
          className="flex items-center gap-3 border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200 transition-colors hover:bg-amber-400/20"
        >
          <Sparkles className="h-4 w-4 flex-none" />
          <span className="flex-1">
            Пройди оценку уровня, чтобы Система настроила план под тебя.
          </span>
          <ChevronRight className="h-4 w-4 flex-none" />
        </Link>
      )}

      {/* Status window */}
      <SystemWindow title="Окно Статуса" tag={`Ранг ${derived.rank}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 flex-none items-center justify-center border-2 border-system/50">
              <span className="text-3xl font-bold text-system system-text-glow">
                {derived.rank}
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background px-1 text-[9px] tracking-widest text-system/70">
                РАНГ
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Игрок
              </p>
              <h1 className="text-xl font-bold tracking-wide text-foreground">
                {profile.name}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-system">
                <span className="font-bold">LV. {derived.level}</span>
                <span className="text-system/40">•</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Flame className="h-3.5 w-3.5" /> {derived.streak} дн.
                </span>
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>ОПЫТ</span>
              <span className="text-system">
                {derived.xpIntoLevel} / {derived.xpToNext} XP
              </span>
            </div>
            <XpBar value={derived.xpIntoLevel} max={derived.xpToNext} />
            <p className="mt-2 text-[11px] text-muted-foreground">
              Всего опыта: <span className="text-system">{derived.totalXp}</span>
            </p>
          </div>
        </div>
      </SystemWindow>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Stats */}
        <SystemWindow title="Характеристики" tag="STATUS">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {STATS.map((s) => {
              const val = derived.stats[s.key];
              const pct = Math.min(100, (val / 80) * 100);
              return (
                <div key={s.key}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-system">
                      {s.label}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {val}
                    </span>
                  </div>
                  <p className="mb-1.5 text-[10px] text-muted-foreground">
                    {s.ru}
                  </p>
                  <div className="h-1 w-full bg-black/50">
                    <div
                      className="h-full bg-system/80"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SystemWindow>

        {/* Today's main quest */}
        <SystemWindow title="Квест дня" tag={sched.day}>
          {todayWorkout ? (
            <Link
              href="/system/workout"
              className="group block border border-system/20 bg-black/20 p-4 transition-all hover:border-system/50 hover:bg-system/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-system/70">
                  Тренировка
                </span>
                <ChevronRight className="h-4 w-4 text-system/60 transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="mt-1 text-lg font-bold text-foreground">
                {todayWorkout.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {todayWorkout.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {todayWorkout.focusGroups.map((g) => (
                  <span
                    key={g}
                    className="border border-system/30 px-2 py-0.5 text-[10px] text-system/80"
                  >
                    {MUSCLE_LABELS[g]}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>Прогресс</span>
                  <span className="text-system">
                    {exercisesDoneToday} / {todayWorkout.exercises.length}
                  </span>
                </div>
                <XpBar
                  value={exercisesDoneToday}
                  max={todayWorkout.exercises.length}
                />
              </div>
            </Link>
          ) : (
            <div className="border border-system/20 bg-black/20 p-6 text-center">
              <p className="text-lg font-bold text-system">ДЕНЬ ОТДЫХА</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Восстановление — часть прокачки. Сон, вода, растяжка.
              </p>
            </div>
          )}

          {/* Phase badge */}
          <div className="mt-4 flex items-center gap-3 border border-system/15 bg-black/20 px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-system/70">
              {phase.tag}
            </span>
            <span className="text-sm font-medium text-foreground">
              {phase.label}
            </span>
          </div>
        </SystemWindow>
      </div>

      {/* Daily habits quick toggle */}
      <SystemWindow title="Ежедневные привычки" tag="DAILY">
        <div className="grid gap-2 sm:grid-cols-2">
          {HABITS.map((h) => (
            <QuestItem
              key={h.id}
              done={today.habitsDone.includes(h.id)}
              title={h.title}
              subtitle={h.description}
              meta={`+${h.xp} XP`}
              onToggle={() => toggleHabit(h.id)}
            />
          ))}
        </div>
      </SystemWindow>

      {/* Water tracker */}
      <SystemWindow title="Гидратация" tag="2–2,5 Л">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Droplet className="h-6 w-6 text-system" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {today.water}
                <span className="text-sm text-muted-foreground"> / 10</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                стаканов по 250 мл
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWater(today.water - 1)}
              className="flex h-10 w-10 items-center justify-center border border-system/30 text-system transition-colors hover:bg-system/10"
              aria-label="Меньше воды"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setWater(today.water + 1)}
              className="flex h-10 w-10 items-center justify-center border border-system/40 bg-system/10 text-system transition-colors hover:bg-system/20"
              aria-label="Больше воды"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 transition-colors ${
                i < today.water ? "bg-system" : "bg-black/50"
              }`}
            />
          ))}
        </div>
      </SystemWindow>
    </div>
  );
}
