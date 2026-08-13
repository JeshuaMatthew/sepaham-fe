/**
 * Override konten buatan dosen di localStorage (di atas mock JSON default).
 * Service membaca override lebih dulu; kalau kosong pakai mock.
 */

export function readOverride<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeOverride<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // abaikan
  }
}

export function removeOverride(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // abaikan
  }
}

export const QUESTIONS_KEY = "sepaham:questions";
export const CATALOG_KEY = "sepaham:roadmaps";
export const treeKey = (id: string) => `sepaham:roadmap-tree-${id}`;
