import axios from "axios";
import type { GithubStats } from "../types/github";

/**
 * Service GitHub Widget (Tahap 2).
 * Nanti diganti call ke GitHub API / backend Axum.
 */

export const GITHUB_QUERY_KEY = ["profile", "github"] as const;

export async function fetchGithubStats(): Promise<GithubStats> {
  const { data } = await axios.get<GithubStats>("/mocks/github.json");
  return data;
}
