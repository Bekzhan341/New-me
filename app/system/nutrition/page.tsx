"use client";

import { Clock, Flame, Beef, CheckCircle2 } from "lucide-react";
import { useSystem } from "@/lib/store";
import { MEALS, RECIPES, NUTRITION_PRINCIPLES } from "@/lib/program";
import { SystemWindow } from "@/components/system/system-window";

export default function NutritionPage() {
  const { ready, today, toggleMeal } = useSystem();
  if (!ready) return null;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-wide text-system system-text-glow">
          ПРОТОКОЛ ПИТАНИЯ
        </h1>
        <p className="text-sm text-muted-foreground">
          Форма «Fight Club»: ~10–12% жира, чистый белок, контроль мусора
        </p>
      </header>

      {/* Principles */}
      <SystemWindow title="Принципы" tag="ОСНОВА">
        <ul className="space-y-2">
          {NUTRITION_PRINCIPLES.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-system" />
              {p}
            </li>
          ))}
        </ul>
      </SystemWindow>

      {/* Meal schedule */}
      <SystemWindow title="График приёмов пищи" tag="ВРЕМЯ">
        <div className="space-y-2">
          {MEALS.map((m) => {
            const done = today.mealsDone.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMeal(m.id)}
                className={`flex w-full items-start gap-3 border px-3 py-3 text-left transition-all ${
                  done
                    ? "border-system/40 bg-system/10"
                    : "border-system/15 bg-black/20 hover:border-system/30"
                }`}
              >
                <span className="flex flex-none flex-col items-center">
                  <span className="flex items-center gap-1 text-sm font-bold text-system">
                    <Clock className="h-3.5 w-3.5" />
                    {m.time}
                  </span>
                </span>
                <span className="flex-1 border-l border-system/20 pl-3">
                  <span className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      {m.title}
                    </span>
                    {done && (
                      <span className="text-[10px] text-system">✓ +8 XP</span>
                    )}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {m.goal}
                  </span>
                  <span className="mt-1 block text-[12px] text-foreground/80">
                    {m.items.join(" · ")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </SystemWindow>

      {/* Recipes */}
      <SystemWindow title="Базовые рецепты" tag="RECIPES">
        <div className="grid gap-3 sm:grid-cols-2">
          {RECIPES.map((r) => (
            <article
              key={r.id}
              className="border border-system/15 bg-black/20 p-4"
            >
              <h3 className="text-sm font-bold text-foreground">{r.title}</h3>
              <div className="mt-1 flex gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-300" /> {r.kcal} ккал
                </span>
                <span className="flex items-center gap-1">
                  <Beef className="h-3 w-3 text-system" /> {r.protein} г белка
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-system/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-system/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <p className="text-[10px] uppercase tracking-widest text-system/60">
                  Ингредиенты
                </p>
                <ul className="mt-1 space-y-0.5 text-[12px] text-muted-foreground">
                  {r.ingredients.map((ing, i) => (
                    <li key={i}>• {ing}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <p className="text-[10px] uppercase tracking-widest text-system/60">
                  Приготовление
                </p>
                <ol className="mt-1 space-y-0.5 text-[12px] text-muted-foreground">
                  {r.steps.map((s, i) => (
                    <li key={i}>
                      <span className="text-system">{i + 1}.</span> {s}
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>
      </SystemWindow>
    </div>
  );
}
