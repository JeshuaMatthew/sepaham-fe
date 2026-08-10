/**
 * CV opsional yang diunggah user saat onboarding, disimpan di localStorage.
 * Dipakai sebagai salah satu sumber data progres karier.
 */

export interface CvInfo {
  fileName: string;
  provided: true;
}

const STORAGE_KEY = "sepaham:cv";

export function getCv(): CvInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CvInfo) : null;
  } catch {
    return null;
  }
}

export function saveCv(fileName: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fileName, provided: true }));
  } catch {
    // abaikan
  }
}

export function clearCv(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
}
