import axios from "axios";
import type { CollabRequest } from "../types/collab";

/**
 * Service "Cari Tim" (request partner proyek). Nanti diganti API Axum.
 */

export const COLLAB_QUERY_KEY = ["collab", "requests"] as const;

export async function fetchCollabRequests(): Promise<CollabRequest[]> {
  const { data } = await axios.get<{ requests: CollabRequest[] }>("/mocks/collabRequests.json");
  return data.requests;
}
