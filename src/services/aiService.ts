import AxiosInstance from "@/lib/axios";
import type { AiFeed } from "@/features/home/types/ai";

/**
 * Service AI & Reminder (backend Axum: GET /api/ai/feed).
 */

export const AI_FEED_QUERY_KEY = ["ai", "feed"] as const;

export async function fetchAiFeed(): Promise<AiFeed> {
  const { data } = await AxiosInstance.get<AiFeed>("/ai/feed");
  // Urutkan magang dari yang paling cocok.
  return {
    ...data,
    internships: [...data.internships].sort((a, b) => b.matchPercent - a.matchPercent),
  };
}
