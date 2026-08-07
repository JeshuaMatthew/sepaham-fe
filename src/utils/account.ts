/**
 * Akun & role aplikasi (mahasiswa vs dosen), disimpan di localStorage.
 * Nanti dipindah ke sistem auth backend. Role dosen bisa mengedit konten
 * (pertanyaan onboarding & roadmap).
 */

export type AccountRole = "student" | "faculty";

export interface Account {
  role: AccountRole;
  name: string;
}

const STORAGE_KEY = "sepaham:account";

export function getAccount(): Account {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Account;
  } catch {
    // abaikan
  }
  return { role: "student", name: "Mahasiswa" };
}

export function saveAccount(account: Account): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch {
    // abaikan
  }
}

export function isFaculty(): boolean {
  return getAccount().role === "faculty";
}

export function isLoggedIn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) != null;
  } catch {
    return false;
  }
}

export function clearAccount(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
}
