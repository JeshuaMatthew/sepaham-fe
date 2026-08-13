import type { QuizQuestion } from "@/features/roadmap/types/roadmap";
import { CloseIcon } from "@/shared/icons";

interface QuizQuestionEditorProps {
  question: QuizQuestion;
  index: number;
  onChange: (index: number, patch: Partial<QuizQuestion>) => void;
  onDelete: (index: number) => void;
}

function QuizQuestionEditor({ question, index, onChange, onDelete }: QuizQuestionEditorProps) {
  const updateOption = (i: number, value: string) => {
    onChange(index, {
      options: question.options.map((option, idx) => (idx === i ? value : option)),
    });
  };

  const removeOption = (i: number) => {
    const options = question.options.filter((_, idx) => idx !== i);
    let correct = question.correctIndex;
    if (i === correct) correct = 0;
    else if (i < correct) correct = correct - 1;
    onChange(index, { options, correctIndex: Math.max(0, Math.min(correct, options.length - 1)) });
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-canvas p-3">
      <div className="flex items-start gap-2">
        <span className="mt-2 font-mono text-xs text-muted">S{index + 1}</span>
        <input
          value={question.question}
          onChange={(event) => onChange(index, { question: event.target.value })}
          placeholder="Tulis pertanyaan"
          className="flex-1 rounded-lg border border-line bg-canvas px-2 py-1.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="cursor-pointer px-1 text-xs font-semibold text-danger hover:underline"
        >
          Hapus
        </button>
      </div>

      <div className="flex flex-col gap-1.5 pl-6">
        {question.options.map((option, i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="radio"
              checked={question.correctIndex === i}
              onChange={() => onChange(index, { correctIndex: i })}
              title="Tandai jawaban benar"
              className="accent-neon"
            />
            <input
              value={option}
              onChange={(event) => updateOption(i, event.target.value)}
              placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
              className="flex-1 rounded-lg border border-line bg-canvas px-2 py-1 text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeOption(i)}
              className="cursor-pointer px-1 text-muted hover:text-danger"
              aria-label="Hapus opsi"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </label>
        ))}
        <button
          type="button"
          onClick={() => onChange(index, { options: [...question.options, ""] })}
          className="w-fit cursor-pointer text-xs font-semibold text-accent hover:underline"
        >
          + opsi
        </button>
        <span className="text-[10px] text-muted">Radio hijau = jawaban benar.</span>
      </div>
    </div>
  );
}

export default QuizQuestionEditor;
