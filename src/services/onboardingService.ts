import axios from "axios";
import type { LikertQuestion } from "../types/onboarding";
import {
  QUESTIONS_KEY,
  readOverride,
  removeOverride,
  writeOverride,
} from "../utils/contentStore";

/**
 * Service Onboarding (kuesioner Likert).
 *
 * Membaca override buatan dosen dulu (localStorage); kalau kosong pakai
 * mock JSON default. `saveOnboardingQuestions` dipakai panel dosen.
 */

export const ONBOARDING_QUESTIONS_QUERY_KEY = ["onboarding", "questions"] as const;

const MOCK_ENDPOINT = "/mocks/onboardingQuestions.json";

export async function fetchOnboardingQuestions(): Promise<LikertQuestion[]> {
  const override = readOverride<LikertQuestion[]>(QUESTIONS_KEY);
  if (override) return override;
  const { data } = await axios.get<{ questions: LikertQuestion[] }>(MOCK_ENDPOINT);
  return data.questions;
}

export function saveOnboardingQuestions(questions: LikertQuestion[]): void {
  writeOverride(QUESTIONS_KEY, questions);
}

/** Hapus override dosen — kembali ke pertanyaan default. */
export function resetOnboardingQuestions(): void {
  removeOverride(QUESTIONS_KEY);
}
