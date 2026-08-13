import { Link } from "react-router-dom";
import type { Server } from "@/features/chat/types/chat";
import { AlertIcon, ArrowLeftIcon, ChatIcon, LockIcon } from "@/shared/icons";

interface FacultyGroupsContainerProps {
  groups: Server[];
  bannedIds: string[];
  isLoading: boolean;
  isError: boolean;
  onToggleBan: (id: string) => void;
  onRetry: () => void;
}

function FacultyGroupsContainer({
  groups,
  bannedIds,
  isLoading,
  isError,
  onToggleBan,
  onRetry,
}: FacultyGroupsContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load groups</h2>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-ink"
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
            <ChatIcon className="h-6 w-6" /> Group moderation
          </h1>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted">
            <LockIcon className="h-3.5 w-3.5" /> You can ban groups & calls, but you can't read
            their messages.
          </p>
        </header>

        {isLoading ? (
          <div className="h-48 rounded-card border border-line bg-surface animate-shimmer" />
        ) : (
          <div className="grid grid-cols-1 border-l border-t border-line">
            {groups.map((group) => {
              const banned = bannedIds.includes(group.id);
              return (
                <div
                  key={group.id}
                  className="flex items-center gap-3 border-r border-b border-line p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold text-primary">
                    {group.initial}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-display text-sm font-semibold text-ink">
                      {group.name}
                    </span>
                    <span className="text-xs text-muted">
                      {banned ? "Banned · chat & calls disabled" : "Group chat & calls"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleBan(group.id)}
                    className={`ml-auto shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      banned
                        ? "border border-line text-muted hover:text-ink"
                        : "bg-danger/15 text-danger hover:bg-danger/25"
                    }`}
                  >
                    {banned ? "Unban" : "Ban group"}
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

export default FacultyGroupsContainer;
