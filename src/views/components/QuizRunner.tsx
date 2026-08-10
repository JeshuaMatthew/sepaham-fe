import { useState } from "react";
import type { QuizQuestion } from "../../types/roadmap";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  passingScore: number;
  initialAnswers: Record<string, number>;
  score: number | undefined;
  passed: boolean;
  onSubmit: (answers: Record<string, number>) => void;
}

function QuizRunner({
  questions,
  passingScore,
  initialAnswers,
  score,
  passed,
  onSubmit,
}: QuizRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);

  const allAnswered = questions.every((question) => answers[question.id] !== undefined);
  const hasScore = score !== undefined;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">
        Jawab semua soal, lalu kumpulkan. Nilai minimal lulus:{" "}
        <span className="text-ink">{passingScore}</span>.
      </p>

      {questions.map((question, index) => (
        <div key={question.id} className="flex flex-col gap-2 rounded-card  p-5">
          <p className="text-sm font-medium text-ink">
            {index + 1}. {question.question}
          </p>
          <div className="flex flex-col gap-1.5">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              return (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary/15 text-ink"
                      : "border-line text-muted hover:border-primary/50 hover:text-ink"
                  }`}
                >
                  <span className="font-mono text-xs">{String.fromCharCode(65 + optionIndex)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {hasScore ? (
        <div
          className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
            passed
              ? "border-neon/40 bg-neon/10 text-neon"
              : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          Nilai kamu: {score} — {passed ? "Lulus!" : `Belum lulus (min ${passingScore})`}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSubmit(answers)}
        disabled={!allAnswered}
        className="w-fit cursor-pointer rounded-full bg-primary px-7 py-3 text-sm font-semibold text-ink transition-transform hover:enabled:scale-105 active:enabled:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {hasScore ? "Kumpulkan ulang" : "Kumpulkan jawaban"}
      </button>
    </div>
  );
}

export default QuizRunner;
