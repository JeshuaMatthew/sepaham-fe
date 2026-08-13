import { useRef } from "react";
import gsap from "gsap";
import type { CollabRequest } from "@/features/collab/types/collab";
import { DmIcon, ExternalIcon, PackageIcon, UsersIcon } from "@/shared/icons";

interface CollabRequestCardProps {
  request: CollabRequest;
  onContact: (request: CollabRequest) => void;
}

/** Ambil "owner/repo" dari URL GitHub untuk ditampilkan ringkas. */
function repoLabel(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
}

function CollabRequestCard({ request, onContact }: CollabRequestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFull = request.status === "full";

  const handleEnter = () => {
    gsap.to(cardRef.current, { y: -4, duration: 0.25, ease: "power3.out" });
  };
  const handleLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex flex-col gap-3 rounded-card  p-5 will-change-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-ink">{request.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isFull ? "bg-muted/20 text-muted" : "bg-neon/15 text-neon"
          }`}
        >
          {isFull ? "Tim penuh" : "Buka"}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted">{request.description}</p>

      {/* Gambar project (kalau ada) */}
      {request.images && request.images.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {request.images.slice(0, 4).map((src, index) => (
            <img
              key={index}
              src={src}
              alt=""
              className="h-14 w-14 border border-line object-cover"
            />
          ))}
        </div>
      ) : null}

      {/* Tag pekerjaan yang dibutuhkan */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted">Butuh:</span>
        {request.neededRoles.map((role) => (
          <span
            key={role}
            className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary"
          >
            {role}
          </span>
        ))}
      </div>

      {/* Tech stack */}
      {request.techStack.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {request.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}

      {/* Repository project (opsional) */}
      {request.repoUrl ? (
        <a
          href={request.repoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="flex w-fit items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs text-ink transition-colors hover:border-primary/60 hover:text-accent"
        >
          <PackageIcon className="h-4 w-4" />
          <span className="font-mono">{repoLabel(request.repoUrl)}</span>
          <ExternalIcon className="h-4 w-4 text-muted" />
        </a>
      ) : null}

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex items-center gap-2">
          <img
            src={request.author.avatar}
            alt={request.author.name}
            className="h-7 w-7 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-ink">{request.author.name}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <UsersIcon className="h-3 w-3" /> {request.membersCurrent}/{request.membersNeeded} ·{" "}
              {request.interested} tertarik
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onContact(request)}
          disabled={isFull}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            isFull
              ? "cursor-not-allowed bg-elevate text-muted"
              : "bg-primary text-canvas hover:scale-105 active:scale-95"
          }`}
        >
          {isFull ? (
            "Penuh"
          ) : (
            <span className="inline-flex items-center gap-1">
              <DmIcon className="h-3.5 w-3.5" /> Gabung via DM
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default CollabRequestCard;
