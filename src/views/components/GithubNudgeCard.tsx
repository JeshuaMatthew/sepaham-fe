import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import type { GithubNudge } from "@/features/home/types/ai";
import { ArrowRightIcon, FireIcon } from "@/shared/icons";

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

  // Streak 0 = GitHub belum terhubung / belum ada commit; jangan tulis
  // "0-day streak" karena menyesatkan.
  const hasStreak = nudge.streak > 0;

  return (
    <div className="flex flex-col gap-4 rounded-card  p-6">
      <div className="flex items-center gap-3">
        <span
          ref={flameRef}
          className={hasStreak ? "text-neon" : "text-muted"}
          aria-hidden="true"
        >
          <FireIcon className="h-6 w-6" />
        </span>
        <span className="font-mono text-sm font-semibold text-ink">
          {hasStreak ? `${nudge.streak}-day streak` : nudge.title}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-ink/85">{nudge.message}</p>

      {/* `cta` kosong = kartu ini murni informatif. Jangan render link kosong
          yang mengarah ke halaman tanpa aksi terkait (mis. connect GitHub yang
          tombolnya sudah tidak ada). */}
      {nudge.cta && (
        <Link
          to="/profile"
          className="inline-flex w-fit items-center gap-1.5 py-1 text-sm font-semibold text-primary"
        >
          {nudge.cta} <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default GithubNudgeCard;
