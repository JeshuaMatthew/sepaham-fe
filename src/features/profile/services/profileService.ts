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

export async function updateProfile(patch: Partial<Profile>): Promise<Profile> {
  const { data } = await AxiosInstance.put<Profile>("/profile", patch);
  return data;
}

/**
 * Badge milik user, lengkap dengan status `earned` yang sebenarnya.
 *
 * Sebelumnya mengambil `GET /api/badges` — katalog publik yang tidak punya
 * akses ke data user mana pun, jadi `earned`-nya selalu `false` dan semua
 * badge tampil terkunci. Endpoint per-user ada di `/profile/badges`.
 */
export async function fetchBadges(): Promise<Badge[]> {
  const { data } = await AxiosInstance.get<Badge[]>("/profile/badges");
  return data;
}
