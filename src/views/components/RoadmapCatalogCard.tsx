import { useRef } from "react";
import gsap from "gsap";
import type { RoadmapSummary } from "../../types/roadmap";
import ProgressBar from "./ProgressBar";
import { ChartIcon, MapIcon, SkillIcon, StarIcon, UserIcon } from "../icons";

interface RoadmapCatalogCardProps {
  roadmap: RoadmapSummary;
  recommended: boolean;
  /** progres user pada roadmap ini (kalau sudah dikerjakan/dibuka). */
  progress?: { completed: number; total: number };
  onOpen: (id: string) => void;
}

function RoadmapCatalogCard({ roadmap, recommended, progress, onOpen }: RoadmapCatalogCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleEnter = () => {
    gsap.to(cardRef.current, { y: -5, duration: 0.28, ease: "power3.out" });
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
      className={`relative flex w-full flex-col gap-3 border p-5 text-left will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
        recommended ? "border-primary" : "border-transparent hover:border-line"
      }`}
    >
      {recommended ? (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
          <StarIcon className="h-3 w-3" /> Recommended for you
        </span>
      ) : null}

      <MapIcon className="h-8 w-8 text-primary" />

      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-semibold text-ink">{roadmap.title}</h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <UserIcon className="h-3.5 w-3.5" /> By {roadmap.author}
        </span>
        <p className="text-sm leading-relaxed text-muted">{roadmap.description}</p>
      </div>

      {progress ? (
        <ProgressBar
          value={progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0}
          label={`${progress.completed}/${progress.total} skills done`}
        />
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1 border border-line px-2.5 py-1">
          <ChartIcon className="h-3 w-3" /> {roadmap.difficulty}
        </span>
        <span className="inline-flex items-center gap-1 border border-line px-2.5 py-1">
          <SkillIcon className="h-3 w-3" /> {roadmap.totalNodes} skills
        </span>
      </div>
    </button>
  );
}

export default RoadmapCatalogCard;
