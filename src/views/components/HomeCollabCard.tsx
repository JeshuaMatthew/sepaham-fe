import { useRef } from "react";
import gsap from "gsap";
import type { CollabRequest } from "../../types/collab";
import StackBadge from "./StackBadge";
import { ArrowRightIcon, UsersIcon } from "../icons";

interface HomeCollabCardProps {
  request: CollabRequest;
  onOpen: () => void;
}

/** Kartu "Cari Tim" ringkas untuk beranda — project mahasiswa yang cocok. */
function HomeCollabCard({ request, onOpen }: HomeCollabCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFull = request.status === "full";

  const handleEnter = () => {
    gsap.to(cardRef.current, { y: -5, duration: 0.28, ease: "power3.out" });
  };
  const handleLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.32, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex flex-col gap-3 p-5 will-change-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-ink">{request.title}</h3>
        <span className="shrink-0 text-[9px] uppercase tracking-wide text-muted">
          {isFull ? "Full" : "Open"}
        </span>
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-muted">{request.description}</p>

      {/* Role yang dibutuhkan */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <span>Needs:</span>
        {request.neededRoles.map((role) => (
          <span key={role} className="text-[11px] font-semibold text-primary">
            {role}
          </span>
        ))}
      </div>

      {/* Tech stack dengan ikon */}
      {request.techStack.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {request.techStack.map((tech) => (
            <StackBadge key={tech} tech={tech} />
          ))}
        </div>
      ) : null}

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs text-muted">
          <img
            src={request.author.avatar}
            alt={request.author.name}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="inline-flex items-center gap-1">
            <UsersIcon className="h-3 w-3" /> {request.membersCurrent}/{request.membersNeeded}
          </span>
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary"
        >
          View team <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default HomeCollabCard;
