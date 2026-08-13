import AxiosInstance from "@/lib/axios";
import type { Preference } from "@/features/onboarding/utils/preference";

/**
 * Sinkronisasi preferensi onboarding (hasil kuesioner) dengan backend Axum.
 * localStorage tetap sumber baca sinkron; fungsi ini push/pull ke server.
 */

export async function fetchPreference(): Promise<Preference | null> {
  const { data } = await AxiosInstance.get<Preference | null>("/preferences");
  return data ?? null;
}

export async function pushPreference(preference: Preference): Promise<void> {
  await AxiosInstance.put("/preferences", preference);
}
