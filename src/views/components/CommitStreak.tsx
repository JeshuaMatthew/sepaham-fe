import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { GithubSummary } from "@/features/profile/types/github";
import { FireIcon } from "@/shared/icons";

interface CommitStreakProps {
  weeks: number[][];
  summary: GithubSummary;
}

// Ramp abu netral sekuensial (gelap -> terang) ala GitHub dark.
const LEVEL_COLORS = [
  "var(--color-elevate)",
  "rgba(229, 229, 229, 0.28)",
  "rgba(229, 229, 229, 0.5)",
  "rgba(229, 229, 229, 0.72)",
  "#e5e5e5",
];

function levelOf(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function CommitStreak({ weeks, summary }: CommitStreakProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-cell]", {
        opacity: 0,
        scale: 0.4,
        duration: 0.4,
        ease: "power2.out",
        stagger: { amount: 0.9, from: "start" },
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Ringkasan streak */}
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-1.5 font-display text-2xl font-bold text-neon">
            <FireIcon className="h-6 w-6" /> {summary.currentStreak}
          </span>
          <span className="text-xs text-muted">hari streak sekarang</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold text-ink">
            {summary.longestStreak}
          </span>
          <span className="text-xs text-muted">streak terpanjang</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold text-ink">
            {summary.totalCommits.toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-muted">total commit setahun</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-2">
        <div ref={gridRef} className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((count, dayIndex) => {
                const level = levelOf(count);
                return (
                  <span
                    key={dayIndex}
                    data-cell
                    title={`${count} kontribusi`}
                    className="h-[11px] w-[11px] rounded-[3px]"
                    style={{ backgroundColor: LEVEL_COLORS[level] }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>Sedikit</span>
        {LEVEL_COLORS.map((color, index) => (
          <span
            key={index}
            className="h-[11px] w-[11px] rounded-[3px]"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
        <span>Banyak</span>
      </div>
    </div>
  );
}

export default CommitStreak;
