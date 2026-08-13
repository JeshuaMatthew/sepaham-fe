import type { NodeSubmission, QuizQuestion, SubmissionType } from "@/features/roadmap/types/roadmap";
import QuizQuestionEditor from "./QuizQuestionEditor";

interface SubmissionEditorProps {
  submission: NodeSubmission;
  onChange: (submission: NodeSubmission) => void;
}

const TYPES: { value: SubmissionType; label: string }[] = [
  { value: "checkmark", label: "Checkmark" },
  { value: "file", label: "File" },
  { value: "text", label: "Teks/Link" },
  { value: "quiz", label: "Kuis bernilai" },
];

function SubmissionEditor({ submission, onChange }: SubmissionEditorProps) {
  const questions = submission.questions ?? [];

  const updateQuestion = (index: number, patch: Partial<QuizQuestion>) => {
    onChange({
      ...submission,
      questions: questions.map((question, idx) => (idx === index ? { ...question, ...patch } : question)),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Jenis submission:</span>
        <select
          value={submission.type}
          onChange={(event) => onChange({ ...submission, type: event.target.value as SubmissionType })}
          className="rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
        >
          {TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {submission.type === "text" || submission.type === "file" ? (
        <input
          value={submission.prompt ?? ""}
          onChange={(event) => onChange({ ...submission, prompt: event.target.value })}
          placeholder="Petunjuk untuk mahasiswa (mis. Tempel link GitHub repo)"
          className="rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
      ) : null}

      {submission.type === "quiz" ? (
        <div className="flex flex-col gap-2">
          <label className="flex w-fit items-center gap-2 text-xs text-muted">
            Nilai lulus (0–100):
            <input
              type="number"
              min="0"
              max="100"
              value={submission.passingScore ?? 60}
              onChange={(event) => onChange({ ...submission, passingScore: Number(event.target.value) })}
              className="w-20 rounded-lg border border-line bg-surface px-2 py-1 text-ink focus:border-primary focus:outline-none"
            />
          </label>
          {questions.map((question, index) => (
            <QuizQuestionEditor
              key={question.id}
              question={question}
              index={index}
              onChange={updateQuestion}
              onDelete={(i) =>
                onChange({ ...submission, questions: questions.filter((_, idx) => idx !== i) })
              }
            />
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...submission,
                questions: [
                  ...questions,
                  { id: crypto.randomUUID().slice(0, 6), question: "", options: ["", ""], correctIndex: 0 },
                ],
              })
            }
            className="w-fit cursor-pointer text-xs font-semibold text-accent hover:underline"
          >
            + soal
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default SubmissionEditor;

