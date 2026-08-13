import AxiosInstance from "@/lib/axios";
import type { Badge, Profile } from "@/features/profile/types/profile";

/**
 * Service Profil & Badges (backend Axum: GET/PUT /api/profile, GET /api/badges).
 */

export const PROFILE_QUERY_KEY = ["profile"] as const;
export const BADGES_QUERY_KEY = ["profile", "badges"] as const;

export async function fetchProfile(): Promise<Profile> {
  const { data } = await AxiosInstance.get<Profile>("/profile");
  return data;
}

/** Simpan perubahan profil ke backend (hanya field yang diisi). */
export async function updateProfile(patch: Partial<Profile>): Promise<Profile> {
  const { data } = await AxiosInstance.put<Profile>("/profile", patch);
  return data;
}

export async function fetchBadges(): Promise<Badge[]> {
  const { data } = await AxiosInstance.get<{ badges: Badge[] }>("/badges");
  return data.badges;
}
