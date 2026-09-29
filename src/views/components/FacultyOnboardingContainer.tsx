/**
 * FacultyOnboardingContainer — tampilan (presentational) untuk editor bank soal
 * onboarding milik dosen.
 */

import { Link } from "react-router-dom";
import type {
  FactItem,
  PillarItem,
  QuestionItem,
} from "@/features/onboarding/services/onboardingService";
import QuestionEditorRow from "./QuestionEditorRow";
import { AlertIcon, ArrowLeftIcon, DocIcon } from "@/shared/icons";

export interface PillarGroup {
  pillar: PillarItem;
  questions: QuestionItem[];
}

interface FacultyOnboardingContainerProps {
  groups: PillarGroup[];
  facts: FactItem[];
  dirty: boolean;
  notice: string | null;
  noticeTone: "ok" | "error";
  isSaving: boolean;
  isLoading: boolean;
  isError: boolean;
  onChange: (id: string, patch: Partial<QuestionItem>) => void;
  onAdd: (pillarId: string) => void;
  onDelete: (id: string) => void;
  onMove: (pillarId: string, id: string, direction: -1 | 1) => void;
  onSave: () => void;
  onRetry: () => void;
}

function FacultyOnboardingContainer({
  groups,
  facts,
  dirty,
  notice,
  noticeTone,
  isSaving,
  isLoading,
  isError,
  onChange,
  onAdd,
  onDelete,
  onMove,
  onSave,
  onRetry,
}: FacultyOnboardingContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Gagal memuat pertanyaan
          </h2>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6 pb-28 pt-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <Link
            to="/faculty"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Panel Dosen
          </Link>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <DocIcon className="h-6 w-6" /> Bank Soal Onboarding
          </h1>
          <p className="text-sm text-muted">
            Ini soal yang benar-benar dilihat mahasiswa di wizard onboarding. Setiap
            pertanyaan menempel pada satu <em>pillar</em> dan satu <em>fact</em>; fact yang
            terkumpul menentukan role yang direkomendasikan.
          </p>
        </header>

        <section className="flex flex-col gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-card border border-line animate-shimmer"
              />
            ))
          ) : (
            groups.map(({ pillar, questions }) => (
              <div key={pillar.id} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="font-display text-base font-bold text-ink">
                    {pillar.name}
                    <span className="ml-2 font-mono text-xs font-normal text-muted">
                      {pillar.id} · {questions.length} soal
                    </span>
                  </h2>
                  {pillar.description ? (
                    <p className="text-xs text-muted">{pillar.description}</p>
                  ) : null}
                </div>

                {questions.map((question, index) => (
                  <QuestionEditorRow
                    key={question.id}
                    question={question}
                    facts={facts}
                    order={index}
                    onChange={(patch) => onChange(question.id, patch)}
                    onDelete={() => onDelete(question.id)}
                    onMove={(direction) => onMove(pillar.id, question.id, direction)}
                    canMoveUp={index > 0}
                    canMoveDown={index < questions.length - 1}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => onAdd(pillar.id)}
                  className="cursor-pointer rounded-card border border-dashed border-line py-3 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  + Tambah soal di {pillar.name}
                </button>
              </div>
            ))
          )}
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/90 px-6 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
          <span
            role="status"
            className={`text-sm ${noticeTone === "error" ? "text-danger" : "text-neon"}`}
          >
            {notice}
          </span>
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || isSaving}
            className={`ml-auto rounded-full px-7 py-2.5 text-sm font-semibold transition-all ${
              dirty && !isSaving
                ? "cursor-pointer bg-primary text-canvas hover:scale-105 active:scale-95"
                : "cursor-not-allowed bg-elevate text-muted"
            }`}
          >
            {isSaving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default FacultyOnboardingContainer;
