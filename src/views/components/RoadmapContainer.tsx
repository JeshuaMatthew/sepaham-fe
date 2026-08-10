import type { NodeStatus, Roadmap } from "../../types/roadmap";
import type { InternshipContact } from "../../types/internship";
import ProgressBar from "./ProgressBar";
import RoadmapFlow from "./RoadmapFlow";
import RoadmapTreeSkeleton from "./RoadmapTreeSkeleton";
import InternshipUnlock from "./InternshipUnlock";
import { AlertIcon, ArrowLeftIcon, UserIcon } from "../icons";

interface RoadmapContainerProps {
  roadmap: Roadmap | null;
  statusById: Record<string, NodeStatus>;
  completedCount: number;
  totalCount: number;
  internshipContacts: InternshipContact[];
  internshipUnlocked: boolean;
  internshipUnlockPercent: number;
  internshipCurrentPercent: number;
  internshipLoading: boolean;
  isLoading: boolean;
  isError: boolean;
  onBack: () => void;
  onSelectNode: (id: string) => void;
  onRetry: () => void;
}

function RoadmapContainer({
  roadmap,
  statusById,
  completedCount,
  totalCount,
  internshipContacts,
  internshipUnlocked,
  internshipUnlockPercent,
  internshipCurrentPercent,
  internshipLoading,
  isLoading,
  isError,
  onBack,
  onSelectNode,
  onRetry,
}: RoadmapContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Couldn't load the roadmap
          </h2>
          <p className="text-sm text-muted">Please try reloading in a moment.</p>
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

  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const showTree = !isLoading && roadmap !== null;

  return (
    <div className="min-h-screen bg-canvas px-6 pb-16 pt-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        {/* Header — bagian penting, dibungkus gradient biru */}
        <header className="grad-blue flex flex-col gap-4 p-6 sm:p-7">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" /> All roadmaps
            </button>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {roadmap ? <>{roadmap.title}</> : "Skill Tree"}
            </h1>
            {roadmap?.author ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <UserIcon className="h-4 w-4" /> Created by {roadmap.author}
              </span>
            ) : null}
            <p className="max-w-xl text-sm text-muted">
              Click a highlighted node to open its lesson & submission. Finish a submission to
              unlock the next skill. Greyed-out nodes are still locked.
            </p>
          </div>
          <ProgressBar
            value={progress}
            label={`Progress — ${completedCount}/${totalCount} skills done`}
          />
        </header>

        {/* Skill tree (React Flow) */}
        {showTree ? (
          <RoadmapFlow
            roadmap={roadmap}
            statusById={statusById}
            onSelectNode={onSelectNode}
          />
        ) : (
          <RoadmapTreeSkeleton />
        )}

        {/* Internship contacts — unlocked when progress is high enough */}
        {showTree ? (
          <InternshipUnlock
            contacts={internshipContacts}
            unlocked={internshipUnlocked}
            unlockPercent={internshipUnlockPercent}
            currentPercent={internshipCurrentPercent}
            completedCount={completedCount}
            totalCount={totalCount}
            isLoading={internshipLoading}
          />
        ) : null}
      </div>
    </div>
  );
}

export default RoadmapContainer;
