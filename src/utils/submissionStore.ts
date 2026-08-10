import type { SubmissionState } from "../types/roadmap";

/**
 * Progres submission mahasiswa per roadmap, disimpan di localStorage agar
 * bertahan saat berpindah halaman (roadmap → node → soal). Nanti bisa
 * dipindah ke backend/akun user.
 */

const keyFor = (roadmapId: string) => `sepaham:submissions:${roadmapId}`;

export function getSubmissions(roadmapId: string): Record<string, SubmissionState> {
  try {
    const raw = localStorage.getItem(keyFor(roadmapId));
    return raw ? (JSON.parse(raw) as Record<string, SubmissionState>) : {};
  } catch {
    return {};
  }
}

export function saveSubmission(
  roadmapId: string,
  nodeId: string,
  state: SubmissionState,
): void {
  try {
    const all = getSubmissions(roadmapId);
    all[nodeId] = state;
    localStorage.setItem(keyFor(roadmapId), JSON.stringify(all));
  } catch {
    // abaikan
  }
}
