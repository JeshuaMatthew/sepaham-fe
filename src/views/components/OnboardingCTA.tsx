import { useNavigate } from "react-router-dom";
import { GradIcon, ArrowRightIcon } from "@/shared/icons";

/**
 * OnboardingCTA — tampilan Home untuk mahasiswa yang belum menyelesaikan
 * onboarding. Menyembunyikan konten khusus student (internships, GitHub
 * streak, roadmap progress) dan menampilkan CTA untuk memulai onboarding.
 */
function OnboardingCTA() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 py-20">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <GradIcon className="h-8 w-8 text-primary" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Temukan Jalur Karirmu
          </h1>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            Jawab beberapa pertanyaan singkat, dan AI kami akan merekomendasikan
            bidang IT yang paling cocok untukmu.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/onboarding")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-canvas transition-transform hover:scale-105"
        >
          Mulai Onboarding <ArrowRightIcon className="h-4 w-4" />
        </button>
        <p className="text-xs text-muted">
          Sekitar 5 menit
        </p>
      </div>
    </div>
  );
}

export default OnboardingCTA;
