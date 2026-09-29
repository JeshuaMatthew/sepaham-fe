import { useOnboarding } from "../context/OnboardingContext";
import PillarSelector from "./PillarSelector";
import { ArrowRightIcon, SparkleIcon } from "@/shared/icons";

export default function PillarValidationStep() {
  const {
    llmAnalysis,
    allPillars,
    suggestedPillars,
    selectedPillar,
    selectPillar,
    confirmPillar,
    isLoadingQuestions,
    error,
  } = useOnboarding();

  const suggestedIds = suggestedPillars.map((p) => p.id);
  const canConfirm = !!selectedPillar && !isLoadingQuestions;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            2
          </span>
          <h2 className="font-display text-xl font-bold text-ink">
            AI Membaca Minatmu
          </h2>
        </div>
        <p className="text-sm text-muted">
          Berdasarkan esaimu, AI kami mendeteksi beberapa pola bakat. Pilih pilar yang paling sesuai denganmu.
        </p>
      </div>

      {/* LLM Analysis summary */}
      {llmAnalysis && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <SparkleIcon className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">
              Analisis AI
            </span>
          </div>
          <p className="text-sm text-ink leading-relaxed">{llmAnalysis.summary_reason}</p>

          {llmAnalysis.detected_traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {llmAnalysis.detected_traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent/10">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.round((llmAnalysis.confidence_score ?? 0) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-muted font-medium">
              {Math.round((llmAnalysis.confidence_score ?? 0) * 100)}% keyakinan
            </span>
          </div>
        </div>
      )}

      {/* Pillar grid */}
      <PillarSelector
        pillars={allPillars}
        suggestedIds={suggestedIds}
        selectedId={selectedPillar?.id ?? null}
        onSelect={selectPillar}
      />

      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-xs text-danger">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={!canConfirm}
        onClick={() => void confirmPillar()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
      >
        {isLoadingQuestions ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Memuat Pertanyaan…</span>
          </>
        ) : (
          <>
            <span>Konfirmasi & Mulai Asesmen</span>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}
