import AxiosInstance from "@/lib/axios";
import type { AiFeed } from "@/features/home/types/ai";

// ---------------------------------------------------------------------------
// AI Feed — GET /api/ai/feed
// ---------------------------------------------------------------------------

export const AI_FEED_QUERY_KEY = ["ai", "feed"] as const;

export async function fetchAiFeed(): Promise<AiFeed> {
  const { data } = await AxiosInstance.get<AiFeed>("/ai/feed");
  return {
    ...data,
    internships: [...data.internships].sort((a, b) => b.matchPercent - a.matchPercent),
  };
}

// ---------------------------------------------------------------------------
// AI Assist — POST /api/ai/assist
// ---------------------------------------------------------------------------

/**
 * Intent yang didukung backend (sesuai AiIntent di Rust).
 * - `recommend_role`  : rekomendasi role/jurusan berdasarkan minat
 * - `explain_roadmap` : penjelasan roadmap + progres user
 * - `career_path`     : panduan karir step-by-step
 * - `find_internship` : rekomendasi magang yang cocok
 * - `general`         : pertanyaan umum (default)
 */
export type AiIntent =
  | "recommend_role"
  | "explain_roadmap"
  | "career_path"
  | "find_internship"
  | "general";

export interface AiAssistRequest {
  message: string;
  intent?: AiIntent;
}

export interface AiAssistResponse {
  response: string;
}

/**
 * Kirim pesan ke AI backend (Gemini via /api/ai/assist).
 * Menggunakan intent `career_path` secara default untuk halaman Career Consult.
 *
 * @throws Error dengan pesan yang siap ditampilkan ke user jika request gagal.
 */
export async function callAiAssist(
  message: string,
  intent: AiIntent = "career_path",
): Promise<string> {
  const { data } = await AxiosInstance.post<AiAssistResponse>("/ai/assist", {
    message,
    intent,
  } satisfies AiAssistRequest);
  return data.response;
}

// ---------------------------------------------------------------------------
// AI Generate — POST /api/ai/generate (general, full DB context)
// ---------------------------------------------------------------------------

export interface AiGenerateRequest {
  message: string;
}

export interface AiGenerateResponse {
  response: string;
}

/**
 * Kirim pesan ke AI backend dengan full context DB (semua roles, roadmaps,
 * internships, progres user). Cocok untuk pertanyaan umum di luar karir.
 *
 * @throws Error dengan pesan yang siap ditampilkan ke user jika request gagal.
 */
export async function callAiGenerate(message: string): Promise<string> {
  const { data } = await AxiosInstance.post<AiGenerateResponse>("/ai/generate", {
    message,
  } satisfies AiGenerateRequest);
  return data.response;
}
