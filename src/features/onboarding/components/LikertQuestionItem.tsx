import type { LikertQuestion } from "@/features/onboarding/types/onboarding";
import { LIKERT_OPTIONS } from "@/features/onboarding/utils/likert";

interface LikertQuestionItemProps {
  question: LikertQuestion;
  index: number;
  value: number | undefined;
  onChange: (id: string, value: number) => void;
}

function LikertQuestionItem({ question, index, value, onChange }: LikertQuestionItemProps) {
  return (
    <div className="flex flex-col gap-3 p-5">
      <p className="text-sm text-ink">
        <span className="font-mono text-muted">{index + 1}. </span>
        {question.text}
      </p>
      <div className="flex items-stretch gap-1.5">
        {LIKERT_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(question.id, option.value)}
              title={option.label}
              aria-pressed={active}
              className={`flex h-10 flex-1 items-center justify-center border text-sm font-semibold ${
                active
                  ? "border-primary text-primary"
                  : "border-line text-muted hover:border-primary/50 hover:text-ink"
              }`}
            >
              {option.value}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted">
        <span>{LIKERT_OPTIONS[0].label}</span>
        <span>{LIKERT_OPTIONS[LIKERT_OPTIONS.length - 1].label}</span>
      </div>
    </div>
  );
}

export default LikertQuestionItem;
