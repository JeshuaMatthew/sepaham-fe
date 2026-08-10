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

/**
 * Cek kedaluwarsa JWT dari klaim `exp` (base64url payload) TANPA verifikasi
 * tanda tangan — cukup untuk guard UX; backend tetap otoritas sebenarnya.
 * Token tak terbaca dianggap invalid.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json) as { exp?: number };
    if (!claims.exp) return false;
    return Date.now() >= claims.exp * 1000;
  } catch {
    return true;
  }
}

/** true jika ada token yang tersimpan dan belum kedaluwarsa. */
export function hasValidToken(): boolean {
  const token = getToken();
  return token != null && !isTokenExpired(token);
}
