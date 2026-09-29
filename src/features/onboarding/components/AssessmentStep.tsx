import { useOnboarding } from "../context/OnboardingContext";
import DynamicQuestionCard from "./DynamicQuestionCard";
import { TargetIcon } from "@/shared/icons";

export default function AssessmentStep() {
  const {
    questions,
    answers,
    setAnswer,
    submitAssessment,
    isEvaluating,
    selectedPillar,
    error,
  } = useOnboarding();

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const allAnswered = answeredCount >= totalCount && totalCount > 0;
  const progressPct = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            3
          </span>
          <h2 className="font-display text-xl font-bold text-ink">
            Asesmen Kemampuan
          </h2>
        </div>
        <p className="text-sm text-muted">
          Jawab pertanyaan berikut jujur sesuai kondisi kamu saat ini — tidak ada jawaban benar atau salah.
        </p>
        {selectedPillar && (
          <span className="inline-block self-start rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
            Pilar: {selectedPillar.name}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="shrink-0 text-xs text-muted font-medium">
          {answeredCount}/{totalCount}
        </span>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        {questions.map((q, i) => (
          <DynamicQuestionCard
            key={q.id}
            question={q}
            index={i}
            answer={answers[q.id]}
            onAnswer={setAnswer}
          />
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-xs text-danger">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={!allAnswered || isEvaluating}
        onClick={() => void submitAssessment()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
      >
        {isEvaluating ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Mengevaluasi hasil…</span>
          </>
        ) : (
          <>
            <span>Lihat Hasil Rekomendasi</span>
            <TargetIcon className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}
