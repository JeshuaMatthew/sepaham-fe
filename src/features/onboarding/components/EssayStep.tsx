import { useOnboarding } from "../context/OnboardingContext";
import GuidedEssayInput from "./GuidedEssayInput";
import { SparkleIcon } from "@/shared/icons";

export default function EssayStep() {
  const { essay, setEssay, submitEssay, isAnalyzing, error } = useOnboarding();
  const canSubmit = essay.trim().length >= 50 && !isAnalyzing;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            1
          </span>
          <h2 className="font-display text-xl font-bold text-ink">
            Ceritakan Minat & Aspirasimu
          </h2>
        </div>
        <p className="text-sm text-muted">
          AI kami akan membaca esaimu, mengekstrak pola bakat, dan merekomendasikan pilar bidang IT yang paling relevan untukmu.
        </p>
      </div>

      <GuidedEssayInput value={essay} onChange={setEssay} disabled={isAnalyzing} />

      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-xs text-danger">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => void submitEssay()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
      >
        {isAnalyzing ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Menganalisis dengan LLM…</span>
          </>
        ) : (
          <>
            <span>Analisis Minat dengan AI</span>
            <SparkleIcon className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}
