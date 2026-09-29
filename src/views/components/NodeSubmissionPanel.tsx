import { useState } from "react";
import type {
  NodeSubmission,
  SubmissionPayload,
  SubmissionState,
} from "@/features/roadmap/types/roadmap";
import { uploadSubmissionFile } from "@/features/roadmap/services/roadmapService";
import { DEFAULT_PASSING_SCORE } from "@/features/roadmap/utils/nodeContent";
import { AlertIcon, ArrowRightIcon, AttachIcon, CheckIcon } from "@/shared/icons";

interface NodeSubmissionPanelProps {
  roadmapId: string;
  /** Dipakai untuk mengunggah bukti ke node yang benar. */
  nodeKey: string;
  submission: NodeSubmission;
  state: SubmissionState | undefined;
  onSubmit: (payload: SubmissionPayload) => void;
  /** untuk submission tipe "quiz" — lanjut ke halaman soal. */
  onStartQuiz: () => void;
}

function NodeSubmissionPanel({
  roadmapId,
  nodeKey,
  submission,
  state,
  onSubmit,
  onStartQuiz,
}: NodeSubmissionPanelProps) {
  const [text, setText] = useState(state?.text ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedName, setUploadedName] = useState(state?.fileName ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const done = state?.done ?? false;

  const errorLine = error ? (
    <p className="flex items-center gap-2 text-xs text-danger">
      <AlertIcon className="h-3.5 w-3.5 shrink-0" />
      {error}
    </p>
  ) : null;

  // --- Checkmark ---
  if (submission.type === "checkmark") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">Tandai selesai kalau kamu sudah paham skill ini.</p>
        {done ? (
          <div className="flex items-center gap-1.5 border border-neon/40 bg-neon/10 px-4 py-3 text-center text-sm font-semibold text-neon">
            <CheckIcon className="h-4 w-4" /> Ditandai selesai
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSubmit({})}
            className="w-fit cursor-pointer py-2 text-sm font-semibold text-primary"
          >
            Tandai selesai
          </button>
        )}
        {/* Node checkmark tidak punya apa pun untuk diverifikasi server, jadi
            statusnya perlu disebut apa adanya: ini klaim kamu sendiri, bukan
            hasil pemeriksaan. */}
        {done ? (
          <p className="text-xs text-muted">
            Status ini adalah deklarasi kamu sendiri — tidak ada berkas atau nilai yang
            diverifikasi untuk node ini.
          </p>
        ) : null}
      </div>
    );
  }

  // --- File ---
  if (submission.type === "file") {
    const handleUpload = async () => {
      if (!file) return;
      setIsUploading(true);
      setError(null);
      try {
        // Berkas benar-benar dikirim ke server dulu. Sebelumnya panel ini
        // hanya mengambil `File.name` lalu mengirimnya sebagai `fileName`,
        // tanpa pernah mengunggah apa pun, dan server menandai node selesai
        // hanya karena string itu tidak kosong.
        const uploaded = await uploadSubmissionFile(roadmapId, nodeKey, file);
        setUploadedName(uploaded.fileName);
        onSubmit({ fileName: uploaded.fileName });
      } catch {
        setError("Gagal mengunggah berkas. Coba lagi.");
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">
          {submission.prompt ?? "Unggah berkas sebagai bukti pengerjaanmu."}
        </p>
        <label className="flex cursor-pointer items-center gap-2 border border-dashed border-line bg-canvas px-4 py-3 text-sm text-muted hover:border-primary/60">
          <AttachIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{file?.name ?? uploadedName ?? "Pilih berkas…"}</span>
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setError(null);
            }}
          />
        </label>
        {done && uploadedName ? (
          <p className="inline-flex items-center gap-1 text-xs text-neon">
            <CheckIcon className="h-3.5 w-3.5" /> Terkirim: {uploadedName}
          </p>
        ) : null}
        {errorLine}
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-fit cursor-pointer py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Mengunggah…" : "Kirim berkas"}
        </button>
      </div>
    );
  }

  // --- Text (mis. link GitHub) ---
  if (submission.type === "text") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">{submission.prompt ?? "Tempel jawaban atau linkmu."}</p>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="https://github.com/username/repo"
          className="border border-line bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
        {done ? (
          <p className="inline-flex items-center gap-1 text-xs text-neon">
            <CheckIcon className="h-3.5 w-3.5" /> Terkirim
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => text.trim() && onSubmit({ text: text.trim() })}
          disabled={!text.trim()}
          className="w-fit cursor-pointer py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Kirim
        </button>
      </div>
    );
  }

  // --- Quiz (soal disembunyikan; buka lewat tombol) ---
  const passing = submission.passingScore ?? DEFAULT_PASSING_SCORE;
  const questionCount = submission.questions?.length ?? 0;
  const hasScore = state?.score !== undefined && state?.score !== null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        {questionCount > 0
          ? `Ada ${questionCount} soal untuk skill ini. Nilai minimal lulus: `
          : "Nilai minimal lulus: "}
        <span className="text-ink">{passing}</span>.
      </p>

      {hasScore ? (
        <div
          className={`border px-4 py-3 text-center text-sm font-semibold ${
            done
              ? "border-neon/40 bg-neon/10 text-neon"
              : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          Nilai terakhirmu: {state?.score} — {done ? "Lulus" : `Belum lulus (min ${passing})`}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onStartQuiz}
        className="inline-flex w-fit items-center gap-1.5 cursor-pointer py-2 text-sm font-semibold text-primary"
      >
        {hasScore ? "Ulangi kuis" : "Mulai kuis"} <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default NodeSubmissionPanel;
