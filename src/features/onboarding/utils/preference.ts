/**
 * Preferensi belajar user (hasil onboarding).
 *
 * `localStorage` di sini hanya CACHE baca-sinkron supaya halaman bisa render
 * tanpa menunggu network. Sumber kebenarannya tetap `GET /preferences` di
 * server — ditulis lewat `pushPreference()` setiap onboarding selesai, dibaca
 * ulang setiap login. Jangan pernah menganggap isi cache ini pasti sama
 * dengan server.
 */

export interface Preference {
  roleId: string;
  roleTitle: string;
  roleEmoji: string;
  /** skor tiap role dari kuesioner Likert (roleId -> skor). */
  roleScores: Record<string, number>;
}

const STORAGE_KEY = "sepaham:preference";

export function getPreference(): Preference | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Preference) : null;
  } catch {
    return null;
  }
}

export function savePreference(preference: Preference): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // storage tidak tersedia — abaikan
  }
}

export function clearPreference(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
}
