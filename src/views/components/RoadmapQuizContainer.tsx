import type { QuizQuestion, Roadmap, RoadmapNode } from "@/features/roadmap/types/roadmap";
import QuizRunner from "./QuizRunner";
import { AlertIcon, ArrowLeftIcon, QuizIcon } from "@/shared/icons";

interface RoadmapQuizContainerProps {
  roadmap: Roadmap | null;
  node: RoadmapNode | null;
  questions: QuizQuestion[];
  passingScore: number;
  initialAnswers: Record<string, number>;
  score: number | undefined;
  passed: boolean;
  isLoading: boolean;
  isError: boolean;
  onBack: () => void;
  onSubmit: (answers: Record<string, number>) => void;
  onRetry: () => void;
}

function RoadmapQuizContainer({
  roadmap,
  node,
  questions,
  passingScore,
  initialAnswers,
  score,
  passed,
  isLoading,
  isError,
  onBack,
  onSubmit,
  onRetry,
}: RoadmapQuizContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Gagal memuat soal</h2>
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
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> {node?.title ?? "Materi"}
          </button>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <QuizIcon className="h-6 w-6" /> Soal — {node?.title ?? ""}
          </h1>
          {roadmap ? (
            <p className="text-sm text-muted">Roadmap {roadmap.title}</p>
          ) : null}
        </header>

        {isLoading || !node ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-32 rounded-card  animate-shimmer" />
            ))}
          </div>
        ) : (
          <QuizRunner
            questions={questions}
            passingScore={passingScore}
            initialAnswers={initialAnswers}
            score={score}
            passed={passed}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default RoadmapQuizContainer;
