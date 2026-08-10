import { useRef } from "react";
import gsap from "gsap";
import type { Repo } from "../../types/github";
import { ForkIcon, PackageIcon, StarIcon } from "../icons";

interface RepoCardProps {
  repo: Repo;
}

function RepoCard({ repo }: RepoCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleEnter = () => {
    gsap.to(cardRef.current, { y: -5, duration: 0.28, ease: "power3.out" });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.32, ease: "power3.out" });
  };

  return (
    <a
      ref={cardRef}
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex h-full flex-col gap-3 rounded-card  p-5 will-change-transform transition-colors duration-200 hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <div className="flex items-center gap-2">
        <PackageIcon className="h-4 w-4 text-muted" />
        <h3 className="font-mono text-sm font-semibold text-accent">{repo.name}</h3>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-muted">{repo.description}</p>

      <div className="flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: repo.languageColor }}
            aria-hidden="true"
          />
          {repo.language}
        </span>
        <span className="inline-flex items-center gap-1">
          <StarIcon className="h-3.5 w-3.5" /> {repo.stars.toLocaleString("id-ID")}
        </span>
        <span className="inline-flex items-center gap-1">
          <ForkIcon className="h-3.5 w-3.5" /> {repo.forks}
        </span>
      </div>
    </a>
  );
}

export default RepoCard;
