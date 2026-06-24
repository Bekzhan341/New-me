"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  DailyLog,
  MuscleGroup,
  PlayerProfile,
  StatKey,
  SystemState,
  Level,
  Phase,
} from "./types";
import {
  HABITS,
  WORKOUT_DAYS,
  rankForLevel,
  xpForLevel,
} from "./program";

const STORAGE_KEY = "arise-system-v1";

// ----- helpers -----

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function currentPhase(d = new Date()): Phase {
  const m = d.getMonth(); // 0-based
  if (m === 6) return "july";
  if (m === 7) return "august";
  return "june";
}

function emptyLog(date: string): DailyLog {
  return {
    date,
    exercisesDone: [],
    habitsDone: [],
    mealsDone: [],
    water: 0,
    xpEarned: 0,
  };
}

function defaultProfile(): PlayerProfile {
  return {
    name: "ОХОТНИК",
    level: 1,
    xp: 0,
    rank: "E",
    phase: currentPhase(),
    selectedGroups: ["back", "chest", "shoulders", "arms", "legs", "core"],
    fitness: {
      pullups: null,
      dips: null,
      pushups: null,
      squats: null,
      core: null,
    },
    stats: { STR: 10, VIT: 10, AGI: 10, INT: 10, PER: 10, SENSE: 10 },
    onboarded: false,
    createdAt: new Date().toISOString(),
  };
}

function defaultState(): SystemState {
  return { profile: defaultProfile(), logs: {} };
}

// ----- XP per action -----

const XP = { exercise: 12, meal: 8, waterPerGlass: 3, maxWater: 10 };

function groupToStat(g: MuscleGroup): StatKey {
  if (g === "legs") return "AGI";
  if (g === "core") return "AGI";
  return "STR";
}

const HABIT_MAP = Object.fromEntries(HABITS.map((h) => [h.id, h]));
const EXERCISE_MAP = Object.fromEntries(
  WORKOUT_DAYS.flatMap((d) => d.exercises).map((e) => [e.id, e])
);

function logXp(log: DailyLog): number {
  let xp = 0;
  xp += log.exercisesDone.length * XP.exercise;
  for (const id of log.habitsDone) xp += HABIT_MAP[id]?.xp ?? 0;
  xp += log.mealsDone.length * XP.meal;
  xp += Math.min(log.water, XP.maxWater) * XP.waterPerGlass;
  return xp;
}

export interface Derived {
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpToNext: number;
  rank: ReturnType<typeof rankForLevel>;
  stats: Record<StatKey, number>;
  streak: number;
}

function derive(state: SystemState): Derived {
  const logs = Object.values(state.logs);

  let totalXp = 0;
  const stats: Record<StatKey, number> = {
    STR: 10,
    VIT: 10,
    AGI: 10,
    INT: 10,
    PER: 10,
    SENSE: 10,
  };

  for (const log of logs) {
    totalXp += logXp(log);
    for (const id of log.exercisesDone) {
      const ex = EXERCISE_MAP[id];
      if (!ex) continue;
      for (const g of ex.groups) stats[groupToStat(g)] += 1;
      stats.SENSE += 1;
    }
    for (const id of log.habitsDone) {
      const h = HABIT_MAP[id];
      if (h) stats[h.stat] += 2;
    }
    stats.VIT += log.mealsDone.length;
    stats.VIT += Math.min(log.water, XP.maxWater) >= 8 ? 1 : 0;
  }

  // level from total xp
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level += 1;
  }

  // streak: consecutive days (ending today/yesterday) with any activity
  let streak = 0;
  const d = new Date();
  // allow streak to count today even if not yet active by checking from today back
  for (let i = 0; i < 400; i++) {
    const key = todayKey(d);
    const log = state.logs[key];
    const active =
      log &&
      (log.exercisesDone.length > 0 ||
        log.habitsDone.length > 0 ||
        log.mealsDone.length > 0 ||
        log.water > 0);
    if (active) {
      streak += 1;
    } else if (i === 0) {
      // today not active yet — keep looking back without breaking
    } else {
      break;
    }
    d.setDate(d.getDate() - 1);
  }

  return {
    totalXp,
    level,
    xpIntoLevel: remaining,
    xpToNext: xpForLevel(level),
    rank: rankForLevel(level),
    stats,
    streak,
  };
}

// ----- context -----

interface SystemContextValue {
  ready: boolean;
  state: SystemState;
  derived: Derived;
  today: DailyLog;
  toggleExercise: (id: string) => void;
  toggleHabit: (id: string) => void;
  toggleMeal: (id: string) => void;
  setWater: (glasses: number) => void;
  setWorkoutDay: (day: "A" | "B" | "rest") => void;
  updateProfile: (patch: Partial<PlayerProfile>) => void;
  setFitness: (key: keyof PlayerProfile["fitness"], level: Level) => void;
  setGroups: (groups: MuscleGroup[]) => void;
  completeOnboarding: (name: string) => void;
  reset: () => void;
}

const SystemContext = createContext<SystemContextValue | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState>(defaultState);
  const [ready, setReady] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SystemState;
        // shallow-merge profile defaults to survive schema changes
        parsed.profile = { ...defaultProfile(), ...parsed.profile };
        parsed.logs = parsed.logs ?? {};
        setState(parsed);
      }
    } catch {
      /* ignore corrupt state */
    }
    setReady(true);
  }, []);

  // persist
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable */
    }
  }, [state, ready]);

  const key = todayKey();

  const mutateToday = useCallback(
    (fn: (log: DailyLog) => DailyLog) => {
      setState((prev) => {
        const existing = prev.logs[key] ?? emptyLog(key);
        const updated = fn({ ...existing });
        updated.xpEarned = logXp(updated);
        return { ...prev, logs: { ...prev.logs, [key]: updated } };
      });
    },
    [key]
  );

  const toggleInArray = (arr: string[], id: string) =>
    arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

  const value = useMemo<SystemContextValue>(() => {
    const today = state.logs[key] ?? emptyLog(key);
    return {
      ready,
      state,
      derived: derive(state),
      today,
      toggleExercise: (id) =>
        mutateToday((l) => ({
          ...l,
          exercisesDone: toggleInArray(l.exercisesDone, id),
        })),
      toggleHabit: (id) =>
        mutateToday((l) => ({
          ...l,
          habitsDone: toggleInArray(l.habitsDone, id),
        })),
      toggleMeal: (id) =>
        mutateToday((l) => ({
          ...l,
          mealsDone: toggleInArray(l.mealsDone, id),
        })),
      setWater: (glasses) =>
        mutateToday((l) => ({ ...l, water: Math.max(0, Math.min(12, glasses)) })),
      setWorkoutDay: (day) => mutateToday((l) => ({ ...l, workoutDay: day })),
      updateProfile: (patch) =>
        setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } })),
      setFitness: (k, level) =>
        setState((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            fitness: { ...prev.profile.fitness, [k]: level },
          },
        })),
      setGroups: (groups) =>
        setState((prev) => ({
          ...prev,
          profile: { ...prev.profile, selectedGroups: groups },
        })),
      completeOnboarding: (name) =>
        setState((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: name.trim() || prev.profile.name,
            onboarded: true,
          },
        })),
      reset: () => setState(defaultState()),
    };
  }, [state, ready, key, mutateToday]);

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
}

export function useSystem(): SystemContextValue {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used within SystemProvider");
  return ctx;
}
