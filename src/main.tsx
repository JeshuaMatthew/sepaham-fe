import { StrictMode, Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Penangkap error tingkat aplikasi.
 *
 * Tanpa ini, satu render yang melempar membuat React melepas seluruh pohon
 * DOM dan pengguna melihat layar putih kosong tanpa cara keluar.
 *
 * Di produksi hanya pesan umum + aksi "Muat ulang" yang ditampilkan. Detail
 * teknis (pesan asli + stack) sengaja disembunyikan kecuali mode dev, karena
 * stack berisi path internal dan data yang tidak boleh bocor ke pengguna.
 */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Belum ada layanan pemantauan error, jadi cukup catat ke console.
    // Baris ini sengaja dipertahankan sebagai titik integrasi kalau nanti ada.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center text-ink"
      >
        <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
        <p className="max-w-md text-sm text-muted">
          Aplikasi gagal menampilkan halaman ini. Coba muat ulang; jika tetap terjadi, periksa koneksi
          Anda lalu coba lagi.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="cursor-pointer border border-line bg-elevate px-4 py-2 text-sm font-medium text-ink hover:border-primary"
        >
          Muat ulang
        </button>
        {import.meta.env.DEV ? (
          <pre className="mt-4 max-w-2xl overflow-auto whitespace-pre-wrap border border-line bg-surface p-3 text-left text-xs text-danger">
            {error.message}
            {"\n"}
            {error.stack}
          </pre>
        ) : null}
      </div>
    );
  }
}

const root = document.getElementById("root");
if (!root) throw new Error('Elemen <div id="root"> tidak ditemukan di index.html');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
