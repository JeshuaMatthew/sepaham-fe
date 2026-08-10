import type { CollabRequest, NewCollabInput } from "../../types/collab";
import CollabFilters from "./CollabFilters";
import CollabRequestCard from "./CollabRequestCard";
import CollabRequestCardSkeleton from "./CollabRequestCardSkeleton";
import CreateRequestModal from "./CreateRequestModal";
import { AlertIcon, SearchIcon } from "../icons";

interface CollabContainerProps {
  requests: CollabRequest[];
  availableRoles: string[];
  roleFilter: string;
  communities: { id: string; name: string }[];
  isCreateOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  onRoleFilterChange: (role: string) => void;
  onContact: (request: CollabRequest) => void;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onCreate: (input: NewCollabInput) => void;
  onGoMyTeams: () => void;
  onRetry: () => void;
}

function CollabContainer({
  requests,
  availableRoles,
  roleFilter,
  communities,
  isCreateOpen,
  isLoading,
  isError,
  onRoleFilterChange,
  onContact,
  onOpenCreate,
  onCloseCreate,
  onCreate,
  onGoMyTeams,
  onRetry,
}: CollabContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load requests</h2>
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

  return (
    <div className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header — bagian penting, dibungkus gradient biru */}
        <header className="grad-blue flex flex-wrap items-end justify-between gap-4 p-6 sm:p-7">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-bold text-ink">Find a project team</h1>
            <p className="text-sm text-muted">
              Got an app idea? Invite other students to join, or hop into an existing request.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onGoMyTeams}
              className="cursor-pointer py-2 text-sm font-semibold text-muted hover:text-ink"
            >
              My teams
            </button>
            <button
              type="button"
              onClick={onOpenCreate}
              className="cursor-pointer py-2 text-sm font-semibold text-primary"
            >
              + New request
            </button>
          </div>
        </header>

        {/* Filter tag */}
        {!isLoading ? (
          <CollabFilters
            roles={availableRoles}
            active={roleFilter}
            onChange={onRoleFilterChange}
          />
        ) : null}

        {/* Grid request */}
        {isLoading ? (
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border-r border-b border-line">
                <CollabRequestCardSkeleton />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <SearchIcon className="h-10 w-10 text-muted" />
            <p className="text-sm text-muted">
              No requests need this role yet. Try another filter or create your own request.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
            {requests.map((request) => (
              <div key={request.id} className="border-r border-b border-line">
                <CollabRequestCard request={request} onContact={onContact} />
              </div>
            ))}
          </div>
        )}
      </div>

      {isCreateOpen ? (
        <CreateRequestModal
          communities={communities}
          onCreate={onCreate}
          onClose={onCloseCreate}
        />
      ) : null}
    </div>
  );
}

export default CollabContainer;
