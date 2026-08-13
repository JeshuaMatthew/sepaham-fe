import ProgressBar from "./ProgressBar";
import { ArrowRightIcon, MapIcon } from "@/shared/icons";

/** Ringkasan roadmap utama yang ditonjolkan di beranda. */
export interface RoadmapHeroData {
  id: string;
  title: string;
  emoji: string;
  color: string;
  difficulty: string;
  completedCount: number;
  totalCount: number;
}

interface HomeRoadmapHeroProps {
  roadmap: RoadmapHeroData | null;
  onOpen: (id: string) => void;
  onBrowse: () => void;
}

function HomeRoadmapHero({ roadmap, onOpen, onBrowse }: HomeRoadmapHeroProps) {
  // Belum ada roadmap terpilih → ajak mulai.
  if (!roadmap) {
    return (
      <section className="flex flex-col items-start gap-4">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          <MapIcon className="h-3.5 w-3.5" /> Roadmap
        </span>
        <h2 className="font-display text-2xl font-bold text-ink">Start your learning path</h2>
        <p className="max-w-lg text-sm text-muted">
          Pick the roadmap that fits your interests and collect skills step by step.
        </p>
        <button
          type="button"
          onClick={onBrowse}
          className="inline-flex items-center gap-1.5 cursor-pointer py-1 text-sm font-semibold text-primary"
        >
          Browse roadmaps <ArrowRightIcon className="h-4 w-4" />
        </button>
      </section>
    );
  }

  const percent =
    roadmap.totalCount > 0 ? Math.round((roadmap.completedCount / roadmap.totalCount) * 100) : 0;
  const started = roadmap.completedCount > 0;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-4xl font-bold leading-tight text-ink">{roadmap.title}</h2>
        <span className="font-display text-3xl font-bold text-primary">{percent}%</span>
      </div>

      <ProgressBar
        value={percent}
        label={`${roadmap.completedCount}/${roadmap.totalCount} skills done`}
      />

      <button
        type="button"
        onClick={() => onOpen(roadmap.id)}
        className="inline-flex w-fit items-center gap-1.5 cursor-pointer py-1 text-sm font-semibold text-primary"
      >
        {started ? "Continue roadmap" : "Start roadmap"} <ArrowRightIcon className="h-4 w-4" />
      </button>
    </section>
  );
}

export default HomeRoadmapHero;
