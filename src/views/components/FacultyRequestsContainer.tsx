import { Link } from "react-router-dom";
import type { CollabRequest } from "@/features/collab/types/collab";
import { AlertIcon, ArrowLeftIcon, UsersIcon } from "@/shared/icons";

interface FacultyRequestsContainerProps {
  requests: CollabRequest[];
  closedIds: string[];
  isLoading: boolean;
  isError: boolean;
  onToggleClose: (id: string) => void;
  onRetry: () => void;
}

function FacultyRequestsContainer({
  requests,
  closedIds,
  isLoading,
  isError,
  onToggleClose,
  onRetry,
}: FacultyRequestsContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load requests</h2>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-canvas"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="grad-blue flex flex-col gap-2 p-6 sm:p-7">
          <Link
            to="/faculty"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Faculty panel
          </Link>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
            <UsersIcon className="h-6 w-6" /> Project requests
          </h1>
          <p className="text-sm text-muted">
            Close a "find a team" request so no one else can join it.
          </p>
        </header>

        {isLoading ? (
          <div className="h-56 rounded-card border border-line bg-surface animate-shimmer" />
        ) : (
          <div className="grid grid-cols-1 border-l border-t border-line">
            {requests.map((request) => {
              const closed = closedIds.includes(request.id) || request.status === "full";
              return (
                <div key={request.id} className="flex flex-col gap-2 border-r border-b border-line p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-sm font-semibold text-ink">
                      {request.title}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${
                        closed ? "text-muted" : "text-neon"
                      }`}
                    >
                      {closed ? "Closed" : "Open"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span>By {request.author.name}</span>
                    <span>·</span>
                    <span>Needs: {request.neededRoles.join(", ")}</span>
                    <span>·</span>
                    <span>
                      {request.membersCurrent}/{request.membersNeeded} members
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleClose(request.id)}
                    className={`w-fit cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      closedIds.includes(request.id)
                        ? "border border-line text-muted hover:text-ink"
                        : "bg-danger/15 text-danger hover:bg-danger/25"
                    }`}
                  >
                    {closedIds.includes(request.id) ? "Reopen request" : "Close request"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyRequestsContainer;
