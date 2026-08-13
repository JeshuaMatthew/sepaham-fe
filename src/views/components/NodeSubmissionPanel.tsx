import { useState } from "react";
import type {
  NodeSubmission,
  SubmissionPayload,
  SubmissionState,
} from "@/features/roadmap/types/roadmap";
import { DEFAULT_PASSING_SCORE } from "@/features/roadmap/utils/nodeContent";
import { ArrowRightIcon, AttachIcon, CheckIcon } from "@/shared/icons";

interface NodeSubmissionPanelProps {
  submission: NodeSubmission;
  state: SubmissionState | undefined;
  onSubmit: (payload: SubmissionPayload) => void;
  /** untuk submission tipe "quiz" — lanjut ke halaman soal. */
  onStartQuiz: () => void;
}

function NodeSubmissionPanel({ submission, state, onSubmit, onStartQuiz }: NodeSubmissionPanelProps) {
  const [fileName, setFileName] = useState(state?.fileName ?? "");
  const [text, setText] = useState(state?.text ?? "");

  const done = state?.done ?? false;

  // --- Checkmark ---
  if (submission.type === "checkmark") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">Mark this once you've mastered the skill.</p>
        {done ? (
          <div className="flex items-center justify-center gap-1.5 border border-neon/40 bg-neon/10 px-4 py-3 text-center text-sm font-semibold text-neon">
            <CheckIcon className="h-4 w-4" /> Marked done
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSubmit({})}
            className="w-fit cursor-pointer py-2 text-sm font-semibold text-primary"
          >
            Mark done
          </button>
        )}
      </div>
    );
  }

  // --- File ---
  if (submission.type === "file") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">{submission.prompt ?? "Upload a file as proof of your work."}</p>
        <label className="flex cursor-pointer items-center gap-2 border border-dashed border-line bg-canvas px-4 py-3 text-sm text-muted hover:border-primary/60">
          <AttachIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{fileName || "Choose a file…"}</span>
          <input
            type="file"
            className="hidden"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
          />
        </label>
        {done ? (
          <p className="inline-flex items-center gap-1 text-xs text-neon">
            <CheckIcon className="h-3.5 w-3.5" /> Submitted: {state?.fileName}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => fileName && onSubmit({ fileName })}
          disabled={!fileName}
          className="w-fit cursor-pointer py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit file
        </button>
      </div>
    );
  }

  // --- Text (mis. link GitHub) ---
  if (submission.type === "text") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">{submission.prompt ?? "Paste your answer/link."}</p>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="https://github.com/username/repo"
          className="border border-line bg-canvas px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
        {done ? (
          <p className="inline-flex items-center gap-1 text-xs text-neon">
            <CheckIcon className="h-3.5 w-3.5" /> Submitted
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => text.trim() && onSubmit({ text: text.trim() })}
          disabled={!text.trim()}
          className="w-fit cursor-pointer py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    );
  }

  // --- Quiz (soal disembunyikan; buka lewat tombol) ---
  const passing = submission.passingScore ?? DEFAULT_PASSING_SCORE;
  const questionCount = submission.questions?.length ?? 0;
  const hasScore = state?.score !== undefined;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        There's a quiz {questionCount > 0 ? `(${questionCount} questions)` : ""} for this skill.
        Passing score: <span className="text-ink">{passing}</span>.
      </p>

      {hasScore ? (
        <div
          className={`border px-4 py-3 text-center text-sm font-semibold ${
            done
              ? "border-neon/40 bg-neon/10 text-neon"
              : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          Last score: {state?.score} — {done ? "Passed" : `Not passed (min ${passing})`}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onStartQuiz}
        className="inline-flex w-fit items-center gap-1.5 cursor-pointer py-2 text-sm font-semibold text-primary"
      >
        {hasScore ? "Retake quiz" : "Take quiz"} <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default NodeSubmissionPanel;
