import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { GithubNudge } from "../../types/ai";
import { ArrowRightIcon, FireIcon } from "../icons";

interface GithubNudgeCardProps {
  nudge: GithubNudge;
}

function GithubNudgeCard({ nudge }: GithubNudgeCardProps) {
  const flameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tween = gsap.to(flameRef.current, {
      scale: 1.15,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-card  p-6">
      <div className="flex items-center gap-3">
        <span ref={flameRef} className="text-neon" aria-hidden="true">
          <FireIcon className="h-6 w-6" />
        </span>
        <span className="font-mono text-sm font-semibold text-ink">
          {nudge.streak}-day streak
        </span>
      </div>

      <p className="text-sm leading-relaxed text-ink/85">{nudge.message}</p>

      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1.5 py-1 text-sm font-semibold text-primary"
      >
        {nudge.cta} <ArrowRightIcon className="h-4 w-4" />
      </a>
    </div>
  );
}

export default GithubNudgeCard;
