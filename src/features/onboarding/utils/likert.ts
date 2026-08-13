import type { LikertQuestion } from "@/features/onboarding/types/onboarding";

/** 1–5 Likert scale. */
export const LIKERT_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

/** Jumlahkan skor tiap role dari jawaban Likert. */
export function computeRoleScores(
  questions: LikertQuestion[],
  answers: Record<string, number>,
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const question of questions) {
    const value = answers[question.id];
    if (!value) continue;
    scores[question.roleId] = (scores[question.roleId] ?? 0) + value;
  }
  return scores;
}

/** Role dengan skor tertinggi. */
export function topRoleId(scores: Record<string, number>): string | null {
  let best: string | null = null;
  let bestValue = -Infinity;
  for (const [roleId, value] of Object.entries(scores)) {
    if (value > bestValue) {
      bestValue = value;
      best = roleId;
    }
  }
  return best;
}
