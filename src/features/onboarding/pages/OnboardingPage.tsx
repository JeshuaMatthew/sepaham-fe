import { OnboardingProvider } from "../context/OnboardingContext";
import OnboardingWizard from "../components/OnboardingWizard";
import { GradIcon } from "@/shared/icons";

function OnboardingPage() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-canvas flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Brand header */}
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <GradIcon className="h-9 w-9" />
            <h1 className="font-display text-2xl font-bold text-ink">
              Temukan Jalur Karirmu
            </h1>
            <p className="text-sm text-muted max-w-sm">
              Ceritakan minatmu, dan AI kami akan membantu menemukan bidang IT yang paling cocok untukmu.
            </p>
          </div>

          {/* Wizard card */}
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
            <OnboardingWizard />
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
}

export default OnboardingPage;
