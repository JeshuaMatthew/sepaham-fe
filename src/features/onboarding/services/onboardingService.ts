import AxiosInstance from "@/lib/axios";

export const ONBOARDING_QUESTIONS_QUERY_KEY = ["onboarding", "questions"] as const;

export interface PillarItem {
  id: string;
  name: string;
  description?: string;
}

export interface LLMAnalysis {
  selected_pillars: string[];
  confidence_score: number;
  detected_traits: string[];
  summary_reason: string;
}

export interface AnalyzeEssayResponse {
  session_id: string;
  analysis: LLMAnalysis;
  suggested_pillars: PillarItem[];
}

export interface QuestionOption {
  label: string;
  fact_id?: string;
}

export type QuestionType = "binary" | "scale" | "choice";

export interface QuestionItem {
  id: string;
  pillar_id: string;
  fact_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: QuestionOption[] | null;
  sort_order: number;
  weight: number;
}

/** Nilai jawaban mentah per pertanyaan, di-key dengan `question.id` (bukan
 * `fact_id` — `fact_id` bisa berulang dalam satu pillar, lihat
 * questions.pillar_id + questions.fact_id yang tidak unik).
 * - binary  -> boolean
 * - scale   -> number 1..5
 * - choice  -> fact_id dari option yang dipilih
 */
export type AnswerValue = boolean | number | string;

export interface QuestionsResponse {
  pillar_id: string;
  questions: QuestionItem[];
}

export interface FactItem {
  id: string;
  name: string;
  category?: string | null;
}

/** Bank soal + referensi untuk editor soal dosen. */
export interface QuestionBank {
  pillars: PillarItem[];
  facts: FactItem[];
  questions: QuestionItem[];
}

export interface AssessmentAnswer {
  fact_id: string;
  value: boolean;
}

export interface EvaluateResponse {
  recommended_role: string;
  recommended_role_name: string;
  recommended_role_emoji: string;
  match_percentage: number;
  roadmap_slug: string;
  all_scores: Record<string, number>;
  session_id?: string;
}

export async function fetchAllPillars(): Promise<PillarItem[]> {
  const { data } = await AxiosInstance.get<PillarItem[]>("/onboarding/pillars");
  return data;
}

export async function analyzeEssay(essay: string): Promise<AnalyzeEssayResponse> {
  const { data } = await AxiosInstance.post<AnalyzeEssayResponse>("/onboarding/analyze-essay", {
    essay,
  });
  return data;
}

export async function fetchPillarQuestions(pillarId: string): Promise<QuestionItem[]> {
  const { data } = await AxiosInstance.get<QuestionsResponse>(`/v1/onboarding/questions?pillar=${pillarId}`);
  return data.questions;
}

/** Semua pertanyaan + daftar pillar/fact. Endpoint khusus faculty. */
export async function fetchQuestionBank(): Promise<QuestionBank> {
  const { data } = await AxiosInstance.get<QuestionBank>("/v1/onboarding/questions/bank");
  return data;
}

/** Simpan bank soal. `id` harus UUID (server memakainya sebagai PK). */
export async function saveQuestionBank(questions: QuestionItem[]): Promise<{ ok: boolean; count: number }> {
  const { data } = await AxiosInstance.put<{ ok: boolean; count: number }>(
    "/v1/onboarding/questions",
    { questions },
  );
  return data;
}

export async function evaluateAssessment(payload: {
  session_id?: string;
  pillar_id: string;
  answers: AssessmentAnswer[];
}): Promise<EvaluateResponse> {
  const { data } = await AxiosInstance.post<EvaluateResponse>("/onboarding/evaluate", payload);
  return data;
}
