/**
 * Akhirkan sesi pengguna: hapus JWT, akun/role, dan preferensi onboarding
 * dari localStorage, lalu pancarkan event "auth-expired" supaya router
 * mengarahkan ke /login.
 *
 * Semua titik keluar dari sesi (tombol Logout, 401 dari AxiosInstance, guard
 * RequireAuth) harus memanggil fungsi INI — bukan `clearAccount()` saja.
 * Kalau hanya akun yang dihapus, `sepaham:token` masih tertinggal sehingga
 * `hasValidToken()` tetap true dan guard mengizinkan akses ke route privat.
 */

import { clearToken } from "./authToken";
import { clearAccount } from "./account";
import { emitAuthExpired } from "./authEvents";

export function endSession(): void {
  clearToken();
  clearAccount();
  // Preferensi onboarding disimpan di localStorage dan bersifat per-pengguna.
  // Kalau tidak dihapus, pengguna berikutnya langsung dianggap "sudah onboarding".
  try {
    localStorage.removeItem("sepaham:preference");
  } catch {
    // storage tidak tersedia — abaikan
  }
  emitAuthExpired();
}
