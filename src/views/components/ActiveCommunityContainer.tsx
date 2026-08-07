import type { ActiveCommunity } from "../../types/activeCommunity";
import ActiveCommunityCard from "./ActiveCommunityCard";
import ActiveCommunityCardSkeleton from "./ActiveCommunityCardSkeleton";
import { ActivityIcon, AlertIcon } from "../icons";

interface ActiveCommunityContainerProps {
  communities: ActiveCommunity[];
  isLoading: boolean;
  isError: boolean;
  onOpenCommunity: () => void;
  onRetry: () => void;
}

function ActiveCommunityContainer({
  communities,
  isLoading,
  isError,
  onOpenCommunity,
  onRetry,
}: ActiveCommunityContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-full items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load presence</h2>
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

  const totalOnline = communities.reduce(
    (sum, community) => sum + community.members.filter((m) => m.status === "online").length,
    0,
  );

  return (
    <div className="min-h-full bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            <ActivityIcon className="h-3.5 w-3.5" /> Active Community
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">Who's active right now?</h1>
          <p className="text-sm text-muted">
            {isLoading
              ? "Loading presence…"
              : `${totalOnline} people online across ${communities.length} communities.`}
          </p>
        </header>

        {/* Daftar komunitas */}
        <div className="flex flex-col gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <ActiveCommunityCardSkeleton key={index} />
              ))
            : communities.map((community) => (
                <ActiveCommunityCard
                  key={community.id}
                  community={community}
                  onOpen={onOpenCommunity}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default ActiveCommunityContainer;
