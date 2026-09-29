/**
 * Catat kegagalan yang tidak ditampilkan ke user.
 *
 * Sebelumnya kode memakai `.catch(() => {})` di banyak tempat, sehingga
 * kegagalan network/API hilang tanpa jejak — pengguna mengira berhasil
 * ("Tersimpan") padahal tidak. Helper ini dipakai untuk kegagalan yang memang
 * tidak perlu mengganggu user (analytics, activity ping, sinkronisasi
 * sekunder): dicatat ke console di dev supaya bisa dilacak, diam di produksi.
 *
 * Untuk kegagalan yang mengubah arti bagi user (kirim pesan, simpan data),
 * JANGAN pakai ini — tampilkan pesan error di UI.
 */
export function reportError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}
