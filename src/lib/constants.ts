export const HABIT_STATUS = {
  LOGGED: "logged",
  SKIPPED: "skipped",
  MISSED: "missed",
} as const;

export type HabitStatus = (typeof HABIT_STATUS)[keyof typeof HABIT_STATUS];