"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useSystem } from "@/lib/store";
import { MUSCLE_LABELS, LEVEL_LABELS } from "@/lib/program";
import type { Level, MuscleGroup, PlayerProfile } from "@/lib/types";
import { SystemWindow } from "@/components/system/system-window";

const FITNESS_TESTS: {
  key: keyof PlayerProfile["fitness"];
  title: string;
  hint: Record<Level, string>;
}[] = [
  {
    key: "pullups",
    title: "Подтягивания прямым хватом",
    hint: { novice: "0–3 раза", intermediate: "4–8 раз", advanced: "9+ раз" },
  },
  {
    key: "dips",
    title: "Отжимания на брусьях",
    hint: { novice: "0–4 раза", intermediate: "5–10 раз", advanced: "11+ раз" },
  },
  {
    key: "pushups",
    title: "Отжимания от пола",
    hint: { novice: "0–15 раз", intermediate: "16–30 раз", advanced: "31+ раз" },
  },
  {
    key: "squats",
    title: "Приседания",
    hint: { novice: "0–20 раз", intermediate: "21–40 раз", advanced: "41+ раз" },
  },
  {
    key: "core",
    title: "Подъём коленей на турнике",
    hint: { novice: "0–8 раз", intermediate: "9–15 раз", advanced: "16+ раз" },
  },
];

const LEVELS: Level[] = ["novice", "intermediate", "advanced"];
const GROUPS: MuscleGroup[] = [
  "back",
  "chest",
  "shoulders",
  "arms",
  "legs",
  "core",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { state, setFitness, setGroups, updateProfile, completeOnboarding } =
    useSystem();
  const [name, setName] = useState(
    state.profile.name === "ОХОТНИК" ? "" : state.profile.name
  );
  const [groups, setLocalGroups] = useState<MuscleGroup[]>(
    state.profile.selectedGroups
  );

  const toggleGroup = (g: MuscleGroup) =>
    setLocalGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  const allRated = FITNESS_TESTS.every((t) => state.profile.fitness[t.key]);
  const canFinish = name.trim().length > 0 && groups.length > 0 && allRated;

  const finish = () => {
    updateProfile({ name: name.trim() });
    setGroups(groups.length ? groups : GROUPS);
    completeOnboarding(name);
    router.push("/system");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <header className="mb-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-system/70">
          Активация Системы
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-wide text-system system-text-glow">
          ОЦЕНКА УРОВНЯ
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ответь на вопросы — Система настроит протокол под тебя.
        </p>
      </header>

      <div className="space-y-5">
        {/* Name */}
        <SystemWindow title="Имя игрока">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введи своё имя"
            maxLength={20}
            className="w-full border border-system/30 bg-black/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-system"
          />
        </SystemWindow>

        {/* Fitness tests */}
        <SystemWindow title="Базовые упражнения" tag="ТЕСТ">
          <p className="mb-4 text-[13px] text-muted-foreground">
            Оцени, сколько повторов ты делаешь в одном подходе с чистой техникой.
          </p>
          <div className="space-y-4">
            {FITNESS_TESTS.map((t) => {
              const current = state.profile.fitness[t.key];
              return (
                <div key={t.key}>
                  <p className="mb-2 text-sm font-bold text-foreground">
                    {t.title}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map((lvl) => {
                      const active = current === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFitness(t.key, lvl)}
                          className={`border px-2 py-2 text-center transition-all ${
                            active
                              ? "border-system/50 bg-system/10"
                              : "border-system/15 bg-black/20 hover:border-system/30"
                          }`}
                        >
                          <span className="block text-[12px] font-bold text-foreground">
                            {LEVEL_LABELS[lvl]}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            {t.hint[lvl]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </SystemWindow>

        {/* Muscle groups */}
        <SystemWindow title="Целевые группы мышц" tag="ФОКУС">
          <p className="mb-3 text-[13px] text-muted-foreground">
            Выбери, какие группы хочешь прокачивать. По умолчанию — всё тело.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GROUPS.map((g) => {
              const active = groups.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGroup(g)}
                  className={`border px-3 py-3 text-sm font-medium transition-all ${
                    active
                      ? "border-system/50 bg-system/10 text-system"
                      : "border-system/15 bg-black/20 text-muted-foreground hover:border-system/30"
                  }`}
                >
                  {MUSCLE_LABELS[g]}
                </button>
              );
            })}
          </div>
        </SystemWindow>

        <button
          type="button"
          disabled={!canFinish}
          onClick={finish}
          className="flex w-full items-center justify-center gap-2 border border-system bg-system/10 px-6 py-4 text-sm font-bold uppercase tracking-widest text-system transition-all hover:bg-system/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Активировать Систему
          <ChevronRight className="h-4 w-4" />
        </button>
        {!canFinish && (
          <p className="text-center text-[12px] text-muted-foreground">
            Заполни имя, оцени все упражнения и выбери хотя бы одну группу мышц.
          </p>
        )}
      </div>
    </div>
  );
}
