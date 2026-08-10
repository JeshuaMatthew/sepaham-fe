import { useRef } from "react";
import gsap from "gsap";
import type { RoadmapSummary } from "../../types/roadmap";
import ProgressBar from "./ProgressBar";
import { ArrowRightIcon, MapIcon } from "../icons";

interface RoadmapContinueCardProps {
  roadmap: RoadmapSummary;
  completed: number;
  total: number;
  /** label sorotan, mis. "Progress terjauh" / "Baru dibuka". */
  label: string;
  onOpen: (id: string) => void;
}

function RoadmapContinueCard({ roadmap, completed, total, label, onOpen }: RoadmapContinueCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleEnter = () => {
    gsap.to(cardRef.current, { y: -4, duration: 0.28, ease: "power3.out" });
  };
  const handleLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.32, ease: "power3.out" });
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onOpen(roadmap.id)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group flex w-full flex-col gap-4  p-5 text-left will-change-transform hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <div className="flex items-center gap-3">
        <MapIcon className="h-7 w-7 shrink-0 text-primary" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="w-fit text-[10px] font-semibold uppercase tracking-wide text-primary">
            {label}
          </span>
          <h3 className="truncate font-display text-base font-semibold text-ink">
            {roadmap.title}
          </h3>
        </div>
        <span className="ml-auto font-display text-2xl font-bold text-primary">{percent}%</span>
      </div>

      <ProgressBar value={percent} label={`${completed}/${total} skills done`} />

      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Continue <ArrowRightIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

export default RoadmapContinueCard;
