import axios from "axios";
import type { AiFeed } from "../types/ai";

/**
 * Service AI & Reminder (Tahap 7).
 * Nanti diganti API Axum (quote generator, GitHub webhook nudge,
 * internship matcher berbasis role & skill user).
 */

export const AI_FEED_QUERY_KEY = ["ai", "feed"] as const;

export async function fetchAiFeed(): Promise<AiFeed> {
  const { data } = await axios.get<AiFeed>("/mocks/aiFeed.json");
  // Urutkan magang dari yang paling cocok.
  return {
    ...data,
    internships: [...data.internships].sort((a, b) => b.matchPercent - a.matchPercent),
  };
}
