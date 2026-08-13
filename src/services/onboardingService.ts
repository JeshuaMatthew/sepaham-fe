import AxiosInstance from "@/lib/axios";
import type { LikertQuestion } from "@/features/onboarding/types/onboarding";
import {
  QUESTIONS_KEY,
  readOverride,
  removeOverride,
  writeOverride,
} from "@/features/roadmap/utils/contentStore";

/**
 * Service Onboarding (kuesioner Likert).
 *
 * Membaca override buatan dosen dulu (localStorage); kalau kosong ambil dari
 * backend Axum (GET /api/onboarding/questions). `saveOnboardingQuestions`
 * dipakai panel dosen (masih override lokal).
 */

export const ONBOARDING_QUESTIONS_QUERY_KEY = ["onboarding", "questions"] as const;

export async function fetchOnboardingQuestions(): Promise<LikertQuestion[]> {
  const override = readOverride<LikertQuestion[]>(QUESTIONS_KEY);
  if (override) return override;
  const { data } = await AxiosInstance.get<{ questions: LikertQuestion[] }>(
    "/onboarding/questions",
  );
  return data.questions;
}

export function saveOnboardingQuestions(questions: LikertQuestion[]): void {
  writeOverride(QUESTIONS_KEY, questions);
  // Sinkronkan ke backend (butuh login dosen; best-effort).
  void AxiosInstance.put("/onboarding/questions", { questions }).catch(() => {});
}

/** Hapus override dosen — kembali ke pertanyaan default. */
export function resetOnboardingQuestions(): void {
  removeOverride(QUESTIONS_KEY);
}
