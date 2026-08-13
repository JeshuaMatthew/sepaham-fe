import AxiosInstance from "@/lib/axios";
import type { GithubStats } from "@/features/profile/types/github";

/**
 * Service GitHub Dev-Card (backend Axum: GET/POST /api/github).
 * Kalau user belum connect (404) atau offline, pakai default kosong di bawah.
 */

export const GITHUB_QUERY_KEY = ["profile", "github"] as const;

/** Dev-card default saat GitHub belum terhubung / server tak terjangkau. */
const EMPTY_STATS: GithubStats = {
  username: "",
  stats: { totalCommits: 0, currentStreak: 0, longestStreak: 0, publicRepos: 0 },
  topLanguages: [],
  weeks: [],
  topRepos: [],
};

export async function fetchGithubStats(): Promise<GithubStats> {
  try {
    const { data } = await AxiosInstance.get<GithubStats>("/github");
    return data;
  } catch {
    return EMPTY_STATS;
  }
}

/** Hubungkan GitHub: backend menandai profil connected + impor snapshot demo. */
export async function connectGithub(username?: string): Promise<GithubStats> {
  const { data } = await AxiosInstance.post<GithubStats>("/github/connect", { username });
  return data;
}
