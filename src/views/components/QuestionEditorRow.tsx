import type { LikertQuestion } from "@/features/onboarding/types/onboarding";
import { ROLE_OPTIONS } from "@/features/onboarding/utils/roleOptions";

interface QuestionEditorRowProps {
  question: LikertQuestion;
  index: number;
  onChange: (index: number, patch: Partial<LikertQuestion>) => void;
  onDelete: (index: number) => void;
}

function QuestionEditorRow({ question, index, onChange, onDelete }: QuestionEditorRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-card  p-4">
      <div className="flex items-start gap-2">
        <span className="mt-2 font-mono text-xs text-muted">{index + 1}.</span>
        <textarea
          value={question.text}
          onChange={(event) => onChange(index, { text: event.target.value })}
          rows={2}
          placeholder="Tulis pernyataan… (contoh: Saya suka mendesain antarmuka)"
          className="flex-1 resize-none rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 pl-6">
        <span className="text-xs text-muted">Jawaban "setuju" memperkuat role:</span>
        <select
          value={question.roleId}
          onChange={(event) => onChange(index, { roleId: event.target.value })}
          className="rounded-lg border border-line bg-canvas px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role.id} value={role.id}>
              {role.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="ml-auto cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

export default QuestionEditorRow;
