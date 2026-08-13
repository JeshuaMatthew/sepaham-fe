import AxiosInstance from "@/lib/axios";
import type { LofiTrack } from "@/features/chat/types/music";

/**
 * Service musik lo-fi (backend Axum: GET /api/music/lofi). Dipakai host untuk
 * memutar lagu saat panggilan.
 */

export const LOFI_TRACKS_QUERY_KEY = ["music", "lofi"] as const;

export async function fetchLofiTracks(): Promise<LofiTrack[]> {
  const { data } = await AxiosInstance.get<{ tracks: LofiTrack[] }>("/music/lofi");
  return data.tracks;
}
