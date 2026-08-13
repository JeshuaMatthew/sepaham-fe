import { useRef } from "react";
import gsap from "gsap";
import type { Internship } from "@/features/home/types/ai";
import StackBadge from "./StackBadge";
import { BriefcaseIcon, PinIcon } from "@/shared/icons";

interface InternshipCardProps {
  internship: Internship;
}

function matchColor(percent: number): string {
  return percent >= 70 ? "#e5e5e5" : "rgba(237, 237, 237, 0.52)";
}

function InternshipCard({ internship }: InternshipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const color = matchColor(internship.matchPercent);

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
      className="flex flex-col gap-3 rounded-card  p-5 will-change-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BriefcaseIcon className="h-6 w-6 shrink-0 text-primary" />
          <div className="flex flex-col">
            <h3 className="font-display text-sm font-semibold text-ink">{internship.role}</h3>
            <span className="text-xs text-muted">{internship.company}</span>
          </div>
        </div>
        <span className="flex flex-col items-center">
          <span className="font-display text-sm font-bold" style={{ color }}>
            {internship.matchPercent}%
          </span>
          <span className="text-[9px] uppercase tracking-wide text-muted">match</span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <PinIcon className="h-3.5 w-3.5" /> {internship.location}
        </span>
        <span>·</span>
        <span>{internship.type}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {internship.tags.map((tag: string) => (
          <StackBadge key={tag} tech={tag} />
        ))}
      </div>

      <button
        type="button"
        className="mt-1 w-fit cursor-pointer text-xs font-semibold text-primary"
      >
        Apply now
      </button>
    </div>
  );
}

export default InternshipCard;
