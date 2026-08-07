import { Link } from "react-router-dom";
import type { RoadmapSummary } from "../../types/roadmap";
import RoadmapEditorCard from "./RoadmapEditorCard";
import { AlertIcon, ArrowLeftIcon, MapIcon } from "../icons";

interface FacultyRoadmapsContainerProps {
  roadmaps: RoadmapSummary[];
  dirty: boolean;
  notice: string | null;
  isLoading: boolean;
  isError: boolean;
  onChange: (id: string, patch: Partial<RoadmapSummary>) => void;
  onAdd: () => void;
  onEditContent: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onReset: () => void;
  onRetry: () => void;
}

function FacultyRoadmapsContainer({
  roadmaps,
  dirty,
  notice,
  isLoading,
  isError,
  onChange,
  onAdd,
  onEditContent,
  onDelete,
  onSave,
  onReset,
  onRetry,
}: FacultyRoadmapsContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Gagal memuat roadmap</h2>
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
    <div className="min-h-screen bg-canvas px-6 pb-28 pt-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <Link
            to="/faculty"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Panel Dosen
          </Link>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <MapIcon className="h-6 w-6" /> Kelola Roadmap
          </h1>
          <p className="text-sm text-muted">
            Atur daftar roadmap yang muncul di katalog mahasiswa. Klik "Edit isi" untuk
            menyunting skill tree tiap roadmap.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-52 rounded-card  animate-shimmer"
              />
            ))
          ) : (
            <>
              {roadmaps.map((roadmap) => (
                <RoadmapEditorCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  onChange={onChange}
                  onEditContent={onEditContent}
                  onDelete={onDelete}
                />
              ))}
              <button
                type="button"
                onClick={onAdd}
                className="cursor-pointer rounded-card border border-dashed border-line py-4 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
              >
                + Tambah roadmap
              </button>
            </>
          )}
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/90 px-6 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
          <span className="text-sm text-neon">{notice}</span>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              Reset ke default
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!dirty}
              className={`rounded-full px-7 py-2.5 text-sm font-semibold transition-all ${
                dirty
                  ? "cursor-pointer bg-primary text-ink hover:scale-105 active:scale-95"
                  : "cursor-not-allowed bg-elevate text-muted"
              }`}
            >
              Simpan
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FacultyRoadmapsContainer;
