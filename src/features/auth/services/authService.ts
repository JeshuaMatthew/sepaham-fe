import axios from "axios";
import AxiosInstance from "@/lib/axios";
import { saveAccount, type AccountRole } from "@/features/auth/utils/account";
import { setToken } from "@/features/auth/utils/authToken";
import { clearPreference, savePreference } from "@/features/onboarding/utils/preference";
import { fetchPreference } from "@/features/onboarding/services/preferenceService";
import type {
  AuthCredentials,
  AuthMode,
  AuthProvider,
  AuthSession,
} from "@/features/auth/types/auth";

export const AUTH_PROVIDERS_QUERY_KEY = ["auth", "providers"] as const;

/**
 * Provider SSO (statis, ikon dirender di SsoButton).
 *
 * GitHub sengaja tidak ada: tidak ada kredensial OAuth (client id/secret) di
 * environment maupun package `@react-oauth/github`, jadi tombolnya tidak akan
 * pernah bisa diimplementasikan. Menampilkan tombol yang mati adalah bug UX —
 * pengguna menekannya dan tidak terjadi apa-apa.
 */
const PROVIDERS: AuthProvider[] = [
  { id: "google", label: "Lanjutkan dengan Google", icon: "google" },
];

export async function fetchAuthProviders(): Promise<AuthProvider[]> {
  return PROVIDERS;
}

interface AuthUserResponse {
  id: string;
  email: string;
  name: string;
  role: AccountRole;
  isNewUser: boolean;
}

interface AuthApiResponse {
  token: string;
  user: AuthUserResponse;
}

/** Nama tampilan default dari bagian sebelum "@" (register tak minta nama). */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim();
  return local && local.length > 0 ? local : "Pengguna";
}

export async function submitAuth(
  mode: AuthMode,
  credentials: AuthCredentials,
): Promise<AuthSession> {
  const path = mode === "register" ? "/auth/register" : "/auth/login";
  // `role` sengaja tidak dikirim. Backend sekarang selalu membuat akun
  // mahasiswa dan tidak menerima field itu; mengirimnya hanya memberi
  // ilusi bahwa pengguna bisa memilih perannya sendiri.
  const body =
    mode === "register"
      ? {
          email: credentials.email,
          password: credentials.password,
          name: nameFromEmail(credentials.email),
        }
      : { email: credentials.email, password: credentials.password };

  try {
    const { data } = await AxiosInstance.post<AuthApiResponse>(path, body);
    setToken(data.token);
    saveAccount({ role: data.user.role, name: data.user.name });
    try {
      const preference = await fetchPreference();
      if (preference) savePreference(preference);
      // Server tidak punya preferensi = user ini belum pernah onboarding.
      // localStorage harus ikut disinkronkan, kalau tidak preferensi user
      // sebelumnya di browser ini ikut terbaca dan HomePage menganggap user
      // sudah punya role (roadmap/internship/GitHub streak tetap tampil).
      else clearPreference();
    } catch {
      // abaikan — user baru / belum onboarding
    }
    return {
      userId: data.user.id,
      email: data.user.email,
      isNewUser: data.user.isNewUser,
      role: data.user.role,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { error?: string } | undefined)?.error;
      if (message) throw new Error(message, { cause: error });
    }
    throw new Error("Tidak bisa terhubung ke server. Coba lagi.", { cause: error });
  }
}

/**
 * SSO via Google.
 *
 * Kirim OAuth **access token** dari popup `@react-oauth/google` ke field
 * `access_token`. Backend memverifikasinya dengan menukarnya ke endpoint
 * userinfo Google, jadi email yang dipakai selalu email yang benar-benar
 * terverifikasi Google.
 *
 * Field `credential` (ID token JWT) tetap didukung backend untuk alur
 * Google Identity Services, tapi token yang dikembalikan `useGoogleLogin`
 * bukan JWT, jadi sebelumnya kode ini mengirim access token ke kolom yang
 * salah dan backend jatuh ke email dari body.
 */
export async function submitGoogleAuth(accessToken: string): Promise<AuthSession> {
  try {
    const { data } = await AxiosInstance.post<AuthApiResponse>("/auth/google", {
      access_token: accessToken,
    });
    setToken(data.token);
    saveAccount({ role: data.user.role, name: data.user.name });
    try {
      const preference = await fetchPreference();
      if (preference) savePreference(preference);
      // Lihat catatan pada submitAuth: server tanpa preferensi = belum onboarding.
      else clearPreference();
    } catch {
      // user baru / belum onboarding
    }
    return {
      userId: data.user.id,
      email: data.user.email,
      isNewUser: data.user.isNewUser,
      role: data.user.role,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { error?: string } | undefined)?.error;
      if (message) throw new Error(message, { cause: error });
    }
    throw new Error("Login Google gagal. Coba lagi.", { cause: error });
  }
}
