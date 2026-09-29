import AxiosInstance from "@/lib/axios";
import type { GithubStats } from "@/features/profile/types/github";

/**
 * Service GitHub Dev-Card (backend Axum: GET/POST /api/github).
 */

export const GITHUB_QUERY_KEY = ["profile", "github"] as const;

/**
 * Ambil Dev-Card GitHub milik user.
 *
 * Sebelumnya semua error ditelan lalu dikembalikan `EMPTY_STATS` berisi nol di
 * semua kolom, sehingga API yang rusak terlihat persis seperti user tanpa
 * aktivitas. Sekarang 404 (belum connect) dikembalikan sebagai `null`, dan
 * error lain dilempar supaya react-query mencatat status error-nya.
 */
export async function fetchGithubStats(): Promise<GithubStats | null> {
  try {
    const { data } = await AxiosInstance.get<GithubStats>("/github");
    return data;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }
    throw error;
  }
}

export async function connectGithub(username?: string): Promise<GithubStats> {
  const { data } = await AxiosInstance.post<GithubStats>("/github/connect", { username });
  return data;
}

export async function disconnectGithub(): Promise<void> {
  await AxiosInstance.delete("/github/connect");
}
