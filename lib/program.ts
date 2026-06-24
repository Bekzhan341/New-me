import type {
  Exercise,
  Habit,
  Meal,
  Recipe,
  ScheduleEntry,
  StatDef,
  WorkoutDay,
  Rank,
  Phase,
} from "./types";

// ======================================================================
//  WORKOUT PROGRAM — bodyweight only, based on the Nightwing / Sung Jin-Woo
//  4-day split (Day A: Pull, Day B: Push + Legs).  3-month progression.
// ======================================================================

export const DAY_A: WorkoutDay = {
  id: "A",
  title: "ДЕНЬ A — ТЯГА",
  subtitle: "Спина · Бицепс · Пресс",
  target: "V-образная спина Найтвинга и рельефный пресс.",
  focusGroups: ["back", "arms", "core"],
  exercises: [
    {
      id: "a1",
      name: "Подтягивания прямым хватом",
      groups: ["back"],
      sets: 4,
      reps: "5–6",
      note: "Не доводи до полного отказа в первом подходе, распределяй силы равномерно.",
      julyNote: "+1 повтор в каждый подход (4×7).",
      augustNote: "Последний подход — до отказа (сколько сможешь).",
    },
    {
      id: "a2",
      name: "Подтягивания обратным хватом",
      groups: ["back", "arms"],
      sets: 3,
      reps: "5",
      note: "Ладонями к себе. Акцент на бицепс.",
      julyNote: "+1 повтор в каждый подход (3×6).",
      augustNote: "Последний подход — до отказа.",
    },
    {
      id: "a3",
      name: "Австралийские подтягивания",
      groups: ["back", "shoulders"],
      sets: 3,
      reps: "10–12",
      note: "На низком турнике. Толщина спины и задняя дельта.",
      julyNote: "Сократи отдых между подходами до 60–90 сек.",
      augustNote: "Пауза 1 сек в верхней точке, лопатки сведены.",
    },
    {
      id: "a4",
      name: "Подъём коленей к груди на турнике",
      groups: ["core"],
      sets: 4,
      reps: "12–15",
      note: "Можно на брусьях. Пресс. Без раскачки.",
      julyNote: "Сократи отдых, держи негатив 2 сек.",
      augustNote: "Подъём прямых ног, если получается.",
    },
  ],
};

export const DAY_B: WorkoutDay = {
  id: "B",
  title: "ДЕНЬ B — ЖИМ + НОГИ",
  subtitle: "Грудь · Трицепс · Плечи · Квадрицепсы",
  target: "Прорисованная грудь «Fight Club» и атлетичные ноги.",
  focusGroups: ["chest", "arms", "shoulders", "legs"],
  exercises: [
    {
      id: "b1",
      name: "Отжимания на брусьях",
      groups: ["chest", "arms"],
      sets: 4,
      reps: "6–7",
      note: "Опускайся до угла 90° в локтях.",
      julyNote: "+1 повтор в каждый подход (4×8).",
      augustNote: "Последний подход — до отказа.",
    },
    {
      id: "b2",
      name: "Отжимания с ногами на возвышенности",
      groups: ["chest", "shoulders"],
      sets: 3,
      reps: "12–15",
      note: "Нагрузка на верх груди и передние дельты.",
      julyNote: "Сократи отдых до 60–90 сек.",
      augustNote: "Взрывной стиль — отталкивайся так, чтобы ладони отрывались.",
    },
    {
      id: "b3",
      name: "Алмазные отжимания",
      groups: ["arms", "chest"],
      sets: 3,
      reps: "10–12",
      note: "Руки близко. Мощный акцент на трицепс и центр груди.",
      julyNote: "Сократи отдых, негатив 2 сек.",
      augustNote: "Взрывной стиль — отрыв ладоней.",
    },
    {
      id: "b4",
      name: "Приседания с выпрыгиванием",
      groups: ["legs"],
      sets: 4,
      reps: "15",
      note: "Взрывная сила ног. Мягкое приземление.",
      julyNote: "+2 повтора (4×17).",
      augustNote: "Последний подход — максимум за 40 сек.",
    },
    {
      id: "b5",
      name: "Выпады",
      groups: ["legs"],
      sets: 3,
      reps: "12 на каждую ногу",
      note: "На месте или в шаге. Спина прямая, колено не валится внутрь.",
      julyNote: "Сократи отдых до 60–90 сек.",
      augustNote: "Болгарские выпады (задняя нога на возвышении), если готов.",
    },
  ],
};

export const WORKOUT_DAYS = [DAY_A, DAY_B];

export const SCHEDULE: ScheduleEntry[] = [
  { day: "Понедельник", label: "День A — Тяга", workout: "A" },
  { day: "Вторник", label: "День B — Жим + Ноги", workout: "B" },
  { day: "Среда", label: "Отдых", workout: "rest" },
  { day: "Четверг", label: "День A — Тяга", workout: "A" },
  { day: "Пятница", label: "День B — Жим + Ноги", workout: "B" },
  { day: "Суббота", label: "Полное восстановление", workout: "rest" },
  { day: "Воскресенье", label: "Полное восстановление", workout: "rest" },
];

/** JS getDay() -> our schedule index (Mon=0 ... Sun=6) */
export function scheduleForDate(date: Date): ScheduleEntry {
  const jsDay = date.getDay(); // 0 = Sun
  const idx = (jsDay + 6) % 7; // Mon -> 0
  return SCHEDULE[idx];
}

export const WARMUP_NOTE =
  "Перед каждой тренировкой — разминка 5–7 мин (суставная разминка, лёгкие махи). Отдых между подходами 1,5–2 мин. Темп: 2 сек вниз, 1 сек вверх, фиксация в верхней точке.";

export const PHASES: Record<
  Phase,
  { label: string; tag: string; goal: string; rules: string[] }
> = {
  june: {
    label: "ИЮНЬ — ОБЪЁМ",
    tag: "Фаза 1",
    goal: "Идеально чистая техника. Базовые цифры.",
    rules: [
      "Придерживайся указанных подходов и повторов.",
      "Без рывков: 2 сек вниз, 1 сек вверх.",
      "Фиксация в верхней точке, плавный негатив.",
    ],
  },
  july: {
    label: "ИЮЛЬ — ИНТЕНСИВНОСТЬ",
    tag: "Фаза 2",
    goal: "Добавляем объём и сокращаем отдых.",
    rules: [
      "+1 повтор в каждый подход на турнике и брусьях.",
      "В отжиманиях отдых между подходами 60–90 сек.",
      "Держи технику, не гонись за читингом.",
    ],
  },
  august: {
    label: "АВГУСТ — ПИК",
    tag: "Фаза 3",
    goal: "Выходим на максимум и взрывную силу.",
    rules: [
      "Последний подход подтягиваний и брусьев — до отказа.",
      "В отжиманиях — взрывной стиль (отрыв ладоней).",
      "Контроль питания: жир 10–12%, чтобы проявить рельеф.",
    ],
  },
};

export function exerciseForPhase(ex: Exercise, phase: Phase): string {
  if (phase === "july" && ex.julyNote) return ex.julyNote;
  if (phase === "august" && ex.augustNote) return ex.augustNote;
  return ex.note ?? "";
}

// ======================================================================
//  NUTRITION — meal timing + "Fight Club" cutting principles
// ======================================================================

export const NUTRITION_PRINCIPLES = [
  "Форма — это минимальный процент жира (~10–12%), при котором видны мышечные волокна.",
  "Убери пищевой мусор: фастфуд, чипсы, газировку и чистый сахар.",
  "Белок — строительный материал: яйца, куриное филе, творог, рыба.",
  "Сложные углеводы: овсянка, гречка, бурый рис.",
  "Пей 2–2,5 литра чистой воды в день (метаболизм + восстановление).",
];

export const MEALS: Meal[] = [
  {
    id: "m1",
    time: "07:30",
    title: "Завтрак",
    goal: "Запуск метаболизма, медленные углеводы + белок",
    items: ["Овсянка на воде/молоке", "2–3 яйца", "Горсть ягод или банан"],
  },
  {
    id: "m2",
    time: "11:00",
    title: "Перекус",
    goal: "Поддержать белок между приёмами",
    items: ["Творог 5%", "Горсть орехов", "Яблоко"],
  },
  {
    id: "m3",
    time: "14:00",
    title: "Обед",
    goal: "Главный приём: белок + сложные углеводы + овощи",
    items: ["Куриное филе / рыба", "Гречка или бурый рис", "Овощной салат"],
  },
  {
    id: "m4",
    time: "17:00",
    title: "Предтрен / Перекус",
    goal: "Энергия на тренировку (за 1–1,5 ч до)",
    items: ["Банан", "Тост с арахисовой пастой", "Зелёный чай / кофе"],
  },
  {
    id: "m5",
    time: "20:00",
    title: "Ужин",
    goal: "Восстановление: белок + овощи, минимум быстрых углеводов",
    items: ["Омлет / рыба / индейка", "Тушёные овощи", "Кефир перед сном"],
  },
];

export const RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Боевая овсянка чемпиона",
    kcal: 420,
    protein: 28,
    tags: ["завтрак", "энергия"],
    ingredients: [
      "60 г овсяных хлопьев",
      "200 мл молока/воды",
      "1 мерная ложка протеина или 2 яичных белка",
      "Горсть ягод, 1 ч.л. мёда",
    ],
    steps: [
      "Свари овсянку на воде/молоке 5 минут.",
      "Сними с огня, вмешай протеин (или приготовь яичные белки отдельно).",
      "Добавь ягоды и немного мёда.",
    ],
  },
  {
    id: "r2",
    title: "Куриное филе + гречка",
    kcal: 540,
    protein: 52,
    tags: ["обед", "набор"],
    ingredients: [
      "200 г куриного филе",
      "80 г гречки (сухой вес)",
      "Специи, немного оливкового масла",
      "Свежие овощи",
    ],
    steps: [
      "Отвари гречку (1:2 с водой, 15 мин).",
      "Филе посоли/поперчи, обжарь на сухой/антипригарной сковороде по 4–5 мин с каждой стороны.",
      "Подавай с овощным салатом.",
    ],
  },
  {
    id: "r3",
    title: "Омлет «Сушка»",
    kcal: 300,
    protein: 30,
    tags: ["ужин", "белок"],
    ingredients: [
      "3 яйца (или 1 целое + 3 белка)",
      "Шпинат / помидоры / перец",
      "Соль, перец",
    ],
    steps: [
      "Взбей яйца, добавь нарезанные овощи.",
      "Готовь на антипригарной сковороде под крышкой 4–5 минут.",
      "Минимум масла — это блюдо для рельефа.",
    ],
  },
  {
    id: "r4",
    title: "Творожный крем перед сном",
    kcal: 220,
    protein: 32,
    tags: ["перед сном", "восстановление"],
    ingredients: [
      "200 г творога 5%",
      "Немного корицы",
      "Подсластитель / половина банана",
    ],
    steps: [
      "Взбей творог блендером до кремовой текстуры.",
      "Добавь корицу и банан.",
      "Медленный белок (казеин) работает всю ночь на восстановление.",
    ],
  },
];

// ======================================================================
//  HABITS — discipline of a Hunter
// ======================================================================

export const HABITS: Habit[] = [
  {
    id: "h1",
    title: "Подъём в 06:30",
    description: "Ранний подъём задаёт ритм всему дню.",
    icon: "Sunrise",
    stat: "PER",
    xp: 15,
  },
  {
    id: "h2",
    title: "Чтение 20 минут",
    description: "Книга вместо ленты. Прокачка интеллекта.",
    icon: "BookOpen",
    stat: "INT",
    xp: 15,
  },
  {
    id: "h3",
    title: "Вода 2–2,5 л",
    description: "8–10 стаканов чистой воды за день.",
    icon: "Droplet",
    stat: "VIT",
    xp: 10,
  },
  {
    id: "h4",
    title: "Без сахара и фастфуда",
    description: "Никакого пищевого мусора сегодня.",
    icon: "Ban",
    stat: "VIT",
    xp: 20,
  },
  {
    id: "h5",
    title: "Сон до 23:00",
    description: "7–8 часов сна — главный анаболик.",
    icon: "Moon",
    stat: "VIT",
    xp: 15,
  },
  {
    id: "h6",
    title: "10 минут растяжки",
    description: "Мобильность плеч и таза, профилактика травм.",
    icon: "StretchHorizontal",
    stat: "AGI",
    xp: 10,
  },
  {
    id: "h7",
    title: "Холодный душ",
    description: "Дисциплина и бодрость с утра.",
    icon: "Snowflake",
    stat: "PER",
    xp: 10,
  },
];

// ======================================================================
//  STATS, RANKS, LEVELING
// ======================================================================

export const STATS: StatDef[] = [
  { key: "STR", label: "STR", ru: "Сила", description: "Тяга, жим, общая мощь." },
  { key: "VIT", label: "VIT", ru: "Выносливость", description: "Питание, сон, вода." },
  { key: "AGI", label: "AGI", ru: "Ловкость", description: "Ноги, взрывная сила, мобильность." },
  { key: "INT", label: "INT", ru: "Интеллект", description: "Чтение и обучение." },
  { key: "PER", label: "PER", ru: "Дисциплина", description: "Режим и привычки." },
  { key: "SENSE", label: "SEN", ru: "Концентрация", description: "Фокус и осознанность." },
];

export const RANK_THRESHOLDS: { rank: Rank; minLevel: number }[] = [
  { rank: "E", minLevel: 1 },
  { rank: "D", minLevel: 5 },
  { rank: "C", minLevel: 10 },
  { rank: "B", minLevel: 18 },
  { rank: "A", minLevel: 28 },
  { rank: "S", minLevel: 40 },
];

export function rankForLevel(level: number): Rank {
  let rank: Rank = "E";
  for (const t of RANK_THRESHOLDS) {
    if (level >= t.minLevel) rank = t.rank;
  }
  return rank;
}

/** XP needed to go from `level` to `level + 1`. */
export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 40;
}

export const MUSCLE_LABELS: Record<string, string> = {
  back: "Спина",
  chest: "Грудь",
  shoulders: "Плечи",
  arms: "Руки",
  legs: "Ноги",
  core: "Пресс",
};

export const LEVEL_LABELS: Record<string, string> = {
  novice: "Новичок",
  intermediate: "Средний",
  advanced: "Продвинутый",
};
