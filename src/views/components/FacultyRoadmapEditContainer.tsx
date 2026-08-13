import { Link } from "react-router-dom";
import type { Roadmap } from "@/features/roadmap/types/roadmap";
import RoadmapFlowEditor from "./RoadmapFlowEditor";
import { AlertIcon, ArrowLeftIcon, EditIcon } from "@/shared/icons";

interface FacultyRoadmapEditContainerProps {
  initialRoadmap: Roadmap | null;
  editorKey: string;
  notice: string | null;
  isLoading: boolean;
  isError: boolean;
  onSave: (roadmap: Roadmap) => void;
  onReset: () => void;
  onRetry: () => void;
  onOpenNodePage: (nodeId: string) => void;
}

function FacultyRoadmapEditContainer({
  initialRoadmap,
  editorKey,
  notice,
  isLoading,
  isError,
  onSave,
  onReset,
  onRetry,
  onOpenNodePage,
}: FacultyRoadmapEditContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Gagal memuat isi roadmap</h2>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-canvas transition-transform hover:scale-105 active:scale-95"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6 pb-16 pt-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-2">
          <Link
            to="/faculty/roadmaps"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Kelola Roadmap
          </Link>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <EditIcon className="h-6 w-6" /> Edit tampilan skill tree
          </h1>
          <p className="text-sm text-muted">
            Atur posisi node, koneksi, garis putus-putus, dan label opsional secara visual.
          </p>
        </header>

        {isLoading || !initialRoadmap ? (
          <div className="h-[720px] rounded-card  animate-shimmer" />
        ) : (
          <RoadmapFlowEditor
            key={editorKey}
            initialRoadmap={initialRoadmap}
            notice={notice}
            onSave={onSave}
            onReset={onReset}
            onOpenNodePage={onOpenNodePage}
          />
        )}
      </div>
    </div>
  );
}

export default FacultyRoadmapEditContainer;
