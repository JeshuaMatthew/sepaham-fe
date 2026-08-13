import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { LanguageStat } from "@/features/profile/types/github";

interface LanguageChartProps {
  languages: LanguageStat[];
}

function LanguageChart({ languages }: LanguageChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Animasi lebar bar (scaleX 0 -> 1) saat masuk.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-bar]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      {languages.map((lang) => (
        <div key={lang.name} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            {/* label langsung: identitas tidak bergantung warna saja */}
            <span className="flex items-center gap-2 text-ink">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: lang.color }}
                aria-hidden="true"
              />
              {lang.name}
            </span>
            <span className="font-mono text-muted">{lang.percentage}%</span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-elevate">
            <div
              data-bar
              title={`${lang.name}: ${lang.percentage}%`}
              className="h-full rounded-full"
              style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LanguageChart;
