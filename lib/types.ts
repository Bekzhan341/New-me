// ===== Core domain types for the ARISE System =====

export type Rank = "E" | "D" | "C" | "B" | "A" | "S";

export type MuscleGroup =
  | "back"
  | "chest"
  | "shoulders"
  | "arms"
  | "legs"
  | "core";

export type Phase = "june" | "july" | "august";

export type Level = "novice" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  groups: MuscleGroup[];
  /** base prescription for June (volume phase) */
  sets: number;
  reps: string;
  note?: string;
  /** how the prescription changes per phase */
  julyNote?: string;
  augustNote?: string;
}

export interface WorkoutDay {
  id: "A" | "B";
  title: string;
  subtitle: string;
  target: string;
  focusGroups: MuscleGroup[];
  exercises: Exercise[];
}

export interface ScheduleEntry {
  day: string; // Понедельник ...
  label: string;
  workout: "A" | "B" | "rest";
}

export interface Meal {
  id: string;
  time: string;
  title: string;
  goal: string;
  items: string[];
}

export interface Recipe {
  id: string;
  title: string;
  kcal: number;
  protein: number;
  tags: string[];
  ingredients: string[];
  steps: string[];
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  stat: StatKey;
  xp: number;
}

export type StatKey = "STR" | "VIT" | "AGI" | "INT" | "PER" | "SENSE";

export interface StatDef {
  key: StatKey;
  label: string;
  ru: string;
  description: string;
}

// ===== Persistent player state =====

export interface PlayerProfile {
  name: string;
  level: number;
  xp: number;
  rank: Rank;
  phase: Phase;
  selectedGroups: MuscleGroup[];
  fitness: {
    pullups: Level | null;
    dips: Level | null;
    pushups: Level | null;
    squats: Level | null;
    core: Level | null;
  };
  stats: Record<StatKey, number>;
  onboarded: boolean;
  createdAt: string;
}

/** A single dated log of what was completed. Keyed by YYYY-MM-DD. */
export interface DailyLog {
  date: string;
  workoutDay?: "A" | "B" | "rest";
  exercisesDone: string[]; // exercise ids
  habitsDone: string[]; // habit ids
  mealsDone: string[]; // meal ids
  water: number; // glasses (250ml)
  xpEarned: number;
}

export interface SystemState {
  profile: PlayerProfile;
  logs: Record<string, DailyLog>;
}
