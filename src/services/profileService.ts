import axios from "axios";
import type { Badge, Profile } from "../types/profile";
import { getProfileOverrides } from "../utils/profileStore";

/**
 * Service Profil & Badges (Tahap 2).
 * Menembak mock JSON di public/mocks/ (nanti diganti API Axum).
 */

export const PROFILE_QUERY_KEY = ["profile"] as const;
export const BADGES_QUERY_KEY = ["profile", "badges"] as const;

export async function fetchProfile(): Promise<Profile> {
  const { data } = await axios.get<Profile>("/mocks/profile.json");
  // Gabungkan perubahan dari "Edit profil" (localStorage) di atas data mock.
  return { ...data, ...getProfileOverrides() };
}

export async function fetchBadges(): Promise<Badge[]> {
  const { data } = await axios.get<{ badges: Badge[] }>("/mocks/badges.json");
  return data.badges;
}
