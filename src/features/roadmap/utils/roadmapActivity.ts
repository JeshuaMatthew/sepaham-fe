/**
 * Jejak aktivitas roadmap: kapan terakhir user membuka/mengerjakan sebuah
 * roadmap (timestamp per roadmapId), disimpan di localStorage.
 */

const STORAGE_KEY = "sepaham:roadmapActivity";

export function getRoadmapActivity(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function markRoadmapActive(roadmapId: string): void {
  try {
    const all = getRoadmapActivity();
    all[roadmapId] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}
