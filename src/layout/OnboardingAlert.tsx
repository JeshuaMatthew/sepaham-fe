import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * OnboardingAlert — notifikasi dismissible di kanan atas yang muncul
 * selama user belum menyelesaikan onboarding.
 *
 * Menerima prop `onboardingDone` dari AppLayout. Begitu onboarding selesai
 * (preference tersimpan), komponen ini tidak dirender sama sekali.
 *
 * Dismissed state disimpan di sessionStorage sehingga muncul lagi
 * setiap sesi baru (tab baru / refresh) sampai onboarding betul-betul selesai.
 */

const SESSION_KEY = "sepaham:onboarding-alert-dismissed";

function OnboardingAlert() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* */ }
    setDismissed(true);
  };

  const handleGoOnboarding = () => {
    handleDismiss();
    void navigate("/onboarding");
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2 border border-line bg-surface px-4 py-3 shadow-lg"
    >
      {/* Header baris atas: label + close */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Dot indikator kuning */}
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
          <p className="text-sm font-semibold text-ink">
            Selesaikan Onboarding
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup notifikasi"
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
        >
          {/* Close × */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <p className="text-xs leading-relaxed text-muted">
        Beberapa fitur terkunci sampai kamu menyelesaikan onboarding. Tidak butuh lama.
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={handleGoOnboarding}
        className="mt-1 self-start border border-line px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-elevate"
      >
        Mulai Onboarding →
      </button>
    </div>
  );
}

export default OnboardingAlert;
