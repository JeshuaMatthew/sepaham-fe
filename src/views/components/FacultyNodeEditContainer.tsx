import { Link } from "react-router-dom";
import type { NodeSubmission } from "../../types/roadmap";
import MarkdownView from "./MarkdownView";
import SubmissionEditor from "./SubmissionEditor";
import { AlertIcon, ArrowLeftIcon, DocIcon, EditIcon } from "../icons";

interface FacultyNodeEditContainerProps {
  roadmapId: string;
  nodeTitle: string;
  article: string;
  submission: NodeSubmission;
  notice: string | null;
  isLoading: boolean;
  isError: boolean;
  notFound: boolean;
  onArticleChange: (value: string) => void;
  onSubmissionChange: (submission: NodeSubmission) => void;
  onSave: () => void;
  onRetry: () => void;
}

function FacultyNodeEditContainer({
  roadmapId,
  nodeTitle,
  article,
  submission,
  notice,
  isLoading,
  isError,
  notFound,
  onArticleChange,
  onSubmissionChange,
  onSave,
  onRetry,
}: FacultyNodeEditContainerProps) {
  if (isError || notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">
            {notFound ? "Node tidak ditemukan" : "Gagal memuat materi"}
          </h2>
          {notFound ? (
            <Link
              to={`/faculty/roadmaps/${roadmapId}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Kembali ke editor roadmap
            </Link>
          ) : (
            <button
              type="button"
              onClick={onRetry}
              className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
            >
              Coba lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6 pb-16 pt-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="flex flex-col gap-2">
          <Link
            to={`/faculty/roadmaps/${roadmapId}`}
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Editor roadmap
          </Link>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <EditIcon className="h-6 w-6" /> Edit halaman: {isLoading ? "…" : nodeTitle}
          </h1>
          <p className="text-sm text-muted">
            Tulis materi node pakai Markdown di kiri, lihat preview hasilnya di kanan.
          </p>
        </header>

        {isLoading ? (
          <div className="h-[420px] rounded-card border border-line bg-surface animate-shimmer" />
        ) : (
          <>
            {/* Editor markdown + preview */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                  <DocIcon className="h-3.5 w-3.5" /> Markdown
                </span>
                <textarea
                  value={article}
                  onChange={(event) => onArticleChange(event.target.value)}
                  rows={22}
                  placeholder={"## Judul materi\n\nTulis penjelasan pakai **Markdown**…\n\n- poin\n- poin"}
                  className="h-[520px] resize-none rounded-card border border-line bg-canvas px-4 py-3 font-mono text-xs leading-relaxed text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted">Preview</span>
                <div className="h-[520px] overflow-y-auto rounded-card border border-line bg-surface px-4 py-3">
                  {article.trim() ? (
                    <MarkdownView content={article} />
                  ) : (
                    <p className="text-sm text-muted">Preview akan muncul di sini…</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submission node */}
            <div className="flex flex-col gap-2 rounded-card border border-line bg-surface p-5">
              <span className="text-sm font-semibold text-ink">Submission node</span>
              <p className="text-xs text-muted">Cara mahasiswa membuktikan penyelesaian node ini.</p>
              <SubmissionEditor submission={submission} onChange={onSubmissionChange} />
            </div>

            {/* Aksi */}
            <div className="flex items-center justify-end gap-3">
              <span className="mr-auto text-sm text-neon">{notice}</span>
              <button
                type="button"
                onClick={onSave}
                className="cursor-pointer rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
              >
                Simpan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FacultyNodeEditContainer;
