import axios from "axios";
import type {
  AuthCredentials,
  AuthMode,
  AuthProvider,
  AuthSession,
} from "../types/auth";

/**
 * Service Autentikasi (Tahap 1.1).
 *
 * Provider SSO dibaca dari mock JSON. `submitAuth` masih simulasi
 * (jeda + validasi ringan) — nanti diganti call nyata ke backend Axum
 * tanpa mengubah kontrak fungsi.
 */

export const AUTH_PROVIDERS_QUERY_KEY = ["auth", "providers"] as const;

const PROVIDERS_ENDPOINT = "/mocks/authProviders.json";
const AUTH_DELAY_MS = 1200;

export async function fetchAuthProviders(): Promise<AuthProvider[]> {
  const { data } = await axios.get<{ providers: AuthProvider[] }>(
    PROVIDERS_ENDPOINT,
  );
  return data.providers;
}

export async function submitAuth(
  mode: AuthMode,
  credentials: AuthCredentials,
): Promise<AuthSession> {
  // Simulasi round-trip ke backend.
  await new Promise((resolve) => setTimeout(resolve, AUTH_DELAY_MS));

  if (!credentials.email.includes("@")) {
    throw new Error("Format email tidak valid.");
  }
  if (credentials.password.length < 6) {
    throw new Error("Password minimal 6 karakter.");
  }

  return {
    userId: "mock-user-id",
    email: credentials.email,
    isNewUser: mode === "register",
  };
}
