import axios from "axios";
import type { LofiTrack } from "../types/music";

/**
 * Service musik lo-fi (mock). Dipakai host untuk memutar lagu saat panggilan.
 */

export const LOFI_TRACKS_QUERY_KEY = ["music", "lofi"] as const;

export async function fetchLofiTracks(): Promise<LofiTrack[]> {
  const { data } = await axios.get<{ tracks: LofiTrack[] }>("/mocks/lofiTracks.json");
  return data.tracks;
}
