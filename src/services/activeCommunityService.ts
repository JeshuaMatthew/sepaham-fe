import axios from "axios";
import type { ActiveCommunity } from "../types/activeCommunity";

/**
 * Service "Komunitas Aktif" (presence). Menembak mock JSON di public/mocks/
 * (nanti diganti API Axum + presence realtime).
 */

export const ACTIVE_COMMUNITY_QUERY_KEY = ["community", "active"] as const;

export async function fetchActiveCommunities(): Promise<ActiveCommunity[]> {
  const { data } = await axios.get<{ communities: ActiveCommunity[] }>(
    "/mocks/activeCommunity.json",
  );
  return data.communities;
}
