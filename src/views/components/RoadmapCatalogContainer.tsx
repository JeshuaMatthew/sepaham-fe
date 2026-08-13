import type { RoadmapSummary } from "@/features/roadmap/types/roadmap";
import { AlertIcon } from "@/shared/icons";
import RoadmapCatalogCard from "./RoadmapCatalogCard";
import RoadmapCatalogCardSkeleton from "./RoadmapCatalogCardSkeleton";
import RoadmapContinueCard from "./RoadmapContinueCard";

interface RoadmapCatalogContainerProps {
  roadmaps: RoadmapSummary[];
  recommendedId: string | null;
  preferenceRole: string;
  /** progres per roadmap (hanya untuk yang sudah dikerjakan/dibuka). */
  progressById: Record<string, { completed: number; total: number }>;
  /** roadmap dengan progres paling jauh. */
  furthestId: string | null;
  /** roadmap yang paling baru dibuka/dikerjakan. */
  recentId: string | null;
  isLoading: boolean;
  isError: boolean;
  onOpen: (id: string) => void;
  onRedoQuiz: () => void;
  onRetry: () => void;
}

function RoadmapCatalogContainer({
  roadmaps,
  recommendedId,
  preferenceRole,
  progressById,
  furthestId,
  recentId,
  isLoading,
  isError,
  onOpen,
  onRedoQuiz,
  onRetry,
}: RoadmapCatalogContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load roadmaps</h2>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer py-2 text-sm font-semibold text-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const furthest = furthestId ? roadmaps.find((roadmap) => roadmap.id === furthestId) ?? null : null;
  const recent = recentId ? roadmaps.find((roadmap) => roadmap.id === recentId) ?? null : null;
  const showContinue = !isLoading && (furthest != null || recent != null);

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* Header — bagian penting, dibungkus gradient biru */}
        <header className="grad-blue flex flex-col gap-2 p-6 sm:p-7">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Roadmap
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">Pick your learning path</h1>
          <p className="max-w-xl text-sm text-muted">
            Sorted to match your preference
            {preferenceRole ? (
              <>
                {" "}
                (<span className="font-semibold text-ink">{preferenceRole}</span>)
              </>
            ) : null}
            .{" "}
            <button
              type="button"
              onClick={onRedoQuiz}
              className="cursor-pointer font-semibold text-accent hover:underline"
            >
              Change preference
            </button>
          </p>
        </header>

        {/* Lanjutkan belajar — roadmap dengan progres terjauh & yang baru dibuka */}
        {showContinue ? (
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">Keep learning</h2>
            <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
              {furthest ? (
                <div className="border-r border-b border-line">
                  <RoadmapContinueCard
                    roadmap={furthest}
                    completed={progressById[furthest.id]?.completed ?? 0}
                    total={progressById[furthest.id]?.total ?? furthest.totalNodes}
                    label="Furthest progress"
                    onOpen={onOpen}
                  />
                </div>
              ) : null}
              {recent && recent.id !== furthest?.id ? (
                <div className="border-r border-b border-line">
                  <RoadmapContinueCard
                    roadmap={recent}
                    completed={progressById[recent.id]?.completed ?? 0}
                    total={progressById[recent.id]?.total ?? recent.totalNodes}
                    label="Recently opened"
                    onOpen={onOpen}
                  />
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Grid katalog */}
        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="border-r border-b border-line">
                  <RoadmapCatalogCardSkeleton />
                </div>
              ))
            : roadmaps.map((roadmap) => (
                <div key={roadmap.id} className="border-r border-b border-line">
                  <RoadmapCatalogCard
                    roadmap={roadmap}
                    recommended={roadmap.id === recommendedId}
                    progress={progressById[roadmap.id]}
                    onOpen={onOpen}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default RoadmapCatalogContainer;
