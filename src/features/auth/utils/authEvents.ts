/**
 * Bus event auth sederhana. `AxiosInstance` memancarkan "auth-expired" saat
 * sebuah request terautentikasi mendapat 401 (token basi/dicabut), dan `App`
 * mendengarkannya untuk redirect ke /login.
 *
 * Dipisah dari AxiosInstance & router supaya tak terjadi siklus impor.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

/** Daftarkan handler; mengembalikan fungsi untuk membatalkan pendaftaran. */
export function onAuthExpired(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Panggil semua handler yang terdaftar (dipanggil AxiosInstance saat 401). */
export function emitAuthExpired(): void {
  for (const listener of listeners) listener();
}
