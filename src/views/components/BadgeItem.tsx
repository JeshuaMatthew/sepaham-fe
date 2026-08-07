import { useRef } from "react";
import gsap from "gsap";
import type { Badge } from "../../types/profile";
import { AwardIcon, LockIcon } from "../icons";

interface BadgeItemProps {
  badge: Badge;
}

function BadgeItem({ badge }: BadgeItemProps) {
  const iconRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!badge.earned) return;
    gsap.to(iconRef.current, { scale: 1.12, rotate: 6, duration: 0.3, ease: "back.out(3)" });
  };

  const handleLeave = () => {
    gsap.to(iconRef.current, { scale: 1, rotate: 0, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div
      title={`${badge.name} — ${badge.description}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`flex flex-col items-center gap-2 text-center ${
        badge.earned ? "" : "opacity-40 grayscale"
      }`}
    >
      <div
        ref={iconRef}
        className="flex h-12 w-12 items-center justify-center will-change-transform"
      >
        {badge.earned ? (
          <AwardIcon className="h-8 w-8 text-primary" />
        ) : (
          <LockIcon className="h-8 w-8 text-muted" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-ink">{badge.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
          {badge.tier}
        </span>
      </div>
    </div>
  );
}

export default BadgeItem;
