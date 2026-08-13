import type { Profile } from "@/features/profile/types/profile";

/**
 * Perubahan profil dari fitur "Edit profil", disimpan sebagai overlay di localStorage.
 */

const STORAGE_KEY = "sepaham:profileOverrides";

export function getProfileOverrides(): Partial<Profile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Profile>) : {};
  } catch {
    return {};
  }
}

export function saveProfileOverrides(patch: Partial<Profile>): void {
  try {
    const current = getProfileOverrides();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {}
}
