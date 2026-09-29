import type { AnswerValue, QuestionItem } from "../services/onboardingService";
import { CheckIcon, CloseIcon } from "@/shared/icons";

const SCALE_LABELS = ["Tidak sama sekali", "Agak", "Lumayan", "Sangat", "Sangat banget"];

interface DynamicQuestionCardProps {
  question: QuestionItem;
  index: number;
  answer: AnswerValue | undefined;
  onAnswer: (questionId: string, value: AnswerValue) => void;
}

export default function DynamicQuestionCard({
  question,
  index,
  answer,
  onAnswer,
}: DynamicQuestionCardProps) {
  const answered = answer !== undefined;
  const isChoice = question.question_type === "choice";
  const isScale = question.question_type === "scale";

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        answered
          ? "border-primary/30 bg-primary/5"
          : "border-line bg-surface"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-bold text-muted border border-line">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-sm text-ink leading-relaxed">{question.question_text}</p>
          {isScale && (
            <p className="mt-1 text-[11px] text-muted">
              Seberapa sesuai dengan situasimu?
            </p>
          )}
        </div>
      </div>

      {isChoice ? (
        // question_type "choice": pilih satu opsi; opsi membawakan fact_id-nya sendiri
        <div className="mt-3 ml-9 flex flex-col gap-2" role="radiogroup">
          {(question.options ?? []).map((option) => {
            const value = option.fact_id ?? option.label;
            const active = answer === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onAnswer(question.id, value)}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-canvas text-muted hover:border-primary/40 hover:text-primary"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : isScale ? (
        // question_type "scale": Likert 1-5
        <div className="mt-3 ml-9 flex flex-col gap-1.5">
          <div className="flex items-stretch gap-1.5" role="radiogroup">
            {[1, 2, 3, 4, 5].map((value) => {
              const active = answer === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={SCALE_LABELS[value - 1]}
                  onClick={() => onAnswer(question.id, value)}
                  className={`flex h-9 flex-1 items-center justify-center border text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-canvas text-muted hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted">
            <span>{SCALE_LABELS[0]}</span>
            <span>{SCALE_LABELS[SCALE_LABELS.length - 1]}</span>
          </div>
        </div>
      ) : (
        // question_type "binary": Ya / Tidak
        <div className="mt-3 ml-9 flex gap-2" role="radiogroup">
          <button
            type="button"
            role="radio"
            aria-checked={answer === true}
            onClick={() => onAnswer(question.id, true)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer ${
              answer === true
                ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
                : "border-line bg-canvas text-muted hover:border-primary/40 hover:text-primary"
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1">
              Ya <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={answer === false}
            onClick={() => onAnswer(question.id, false)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer ${
              answer === false
                ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
                : "border-line bg-canvas text-muted hover:border-primary/40 hover:text-primary"
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1">
              Tidak <CloseIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
