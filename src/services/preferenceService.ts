import AxiosInstance from "../utils/Axiosinstance";
import type { Preference } from "../utils/preference";

/**
 * Sinkronisasi preferensi onboarding (hasil kuesioner) dengan backend Axum.
 * localStorage tetap sumber baca sinkron; fungsi ini push/pull ke server.
 */

/** Ambil preferensi tersimpan user; null kalau belum onboarding. */
export async function fetchPreference(): Promise<Preference | null> {
  const { data } = await AxiosInstance.get<Preference | null>("/preferences");
  return data ?? null;
}

/** Simpan preferensi ke backend (upsert). */
export async function pushPreference(preference: Preference): Promise<void> {
  await AxiosInstance.put("/preferences", preference);
}
