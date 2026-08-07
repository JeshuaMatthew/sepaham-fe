import type { ActiveCommunity } from "../../types/activeCommunity";
import { ArrowRightIcon } from "../icons";

interface ActiveCommunityCardProps {
  community: ActiveCommunity;
  onOpen: () => void;
}

function ActiveCommunityCard({ community, onOpen }: ActiveCommunityCardProps) {
  const onlineCount = community.members.filter((member) => member.status === "online").length;

  return (
    <section className="flex flex-col gap-4  p-5">
      {/* Community header */}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center text-base font-bold text-primary">
          {community.initial}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="truncate font-display text-base font-semibold text-ink">
            {community.name}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            {onlineCount} online · {community.members.length} active
          </span>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs font-semibold text-primary"
        >
          Open <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Active members */}
      <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
        {community.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 border-r border-b border-line px-3 py-2"
          >
            <span className="relative shrink-0">
              <img
                src={member.avatar}
                alt={member.name}
                className="h-9 w-9 rounded-full object-cover"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-canvas"
                style={{
                  backgroundColor:
                    member.status === "online" ? "var(--color-primary)" : "var(--color-muted)",
                }}
              />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-ink">{member.name}</span>
              <span className="truncate text-xs text-muted">
                {member.role} · {member.activity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ActiveCommunityCard;
