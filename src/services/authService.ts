import axios from "axios";
import AxiosInstance from "../utils/Axiosinstance";
import { saveAccount, type AccountRole } from "../utils/account";
import { setToken } from "../utils/authToken";
import { savePreference } from "../utils/preference";
import { fetchPreference } from "./preferenceService";
import type {
  AuthCredentials,
  AuthMode,
  AuthProvider,
  AuthSession,
} from "../types/auth";

/**
 * Service Autentikasi.
 *
 * Provider SSO masih dari mock JSON (daftar statis untuk UI). `submitAuth`
 * memanggil backend Axum (register/login), menyimpan JWT + akun, lalu
 * mengembalikan session.
 */

export const AUTH_PROVIDERS_QUERY_KEY = ["auth", "providers"] as const;

/** Provider SSO (statis, ikon dirender di SsoButton). OAuth belum tersambung. */
const PROVIDERS: AuthProvider[] = [
  { id: "google", label: "Lanjutkan dengan Google", icon: "google" },
  { id: "github", label: "Lanjutkan dengan GitHub", icon: "github" },
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
  role: AccountRole,
): Promise<AuthSession> {
  const path = mode === "register" ? "/auth/register" : "/auth/login";
  const body =
    mode === "register"
      ? {
          email: credentials.email,
          password: credentials.password,
          name: nameFromEmail(credentials.email),
          role,
        }
      : { email: credentials.email, password: credentials.password };

  try {
    const { data } = await AxiosInstance.post<AuthApiResponse>(path, body);
    setToken(data.token);
    saveAccount({ role: data.user.role, name: data.user.name });
    // Tarik preferensi onboarding user (kalau ada) supaya tak perlu ulang.
    try {
      const preference = await fetchPreference();
      if (preference) savePreference(preference);
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
    // Tampilkan pesan dari backend ({ error: "..." }) kalau ada.
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { error?: string } | undefined)?.error;
      if (message) throw new Error(message, { cause: error });
    }
    throw new Error("Tidak bisa terhubung ke server. Coba lagi.", { cause: error });
  }
}
