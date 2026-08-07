/**
 * Tipe data untuk Autentikasi (Tahap 1.1 — Login/Register).
 */

export type AuthMode = "login" | "register";

export interface AuthProvider {
  id: string;
  label: string;
  /** kunci ikon brand yang dirender di SsoButton (mis. "google", "github"). */
  icon: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  /** true jika baru mendaftar — dipakai untuk mengarahkan ke onboarding. */
  isNewUser: boolean;
}
