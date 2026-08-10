/**
 * JWT dari backend, disimpan di localStorage dan dilampirkan otomatis ke setiap
 * request oleh AxiosInstance (Authorization: Bearer ...).
 */

const STORAGE_KEY = "sepaham:token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // storage tidak tersedia — abaikan
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
}
