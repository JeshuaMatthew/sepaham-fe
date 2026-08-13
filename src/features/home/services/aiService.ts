import AxiosInstance from "@/lib/axios";
import type { AiFeed } from "@/features/home/types/ai";

export const AI_FEED_QUERY_KEY = ["ai", "feed"] as const;

export async function fetchAiFeed(): Promise<AiFeed> {
  const { data } = await AxiosInstance.get<AiFeed>("/ai/feed");
  return {
    ...data,
    internships: [...data.internships].sort((a, b) => b.matchPercent - a.matchPercent),
  };
}
