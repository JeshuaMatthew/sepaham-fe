import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { QuizIcon } from "../icons";

// Status microcopy — UI text only, not domain data.
const STATUS_MESSAGES = [
  "Analyzing your interests...",
  "Matching against 10+ IT roles...",
  "Computing your fit score...",
  "Drafting your roadmap...",
  "Almost done",
];

function RoadmapLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Animasi visual (orbit + pulse core) — GSAP.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-orbit-fast]", {
        rotate: 360,
        duration: 3,
        ease: "none",
        repeat: -1,
        transformOrigin: "center center",
      });
      gsap.to("[data-orbit-slow]", {
        rotate: -360,
        duration: 6,
        ease: "none",
        repeat: -1,
        transformOrigin: "center center",
      });
      gsap.to("[data-core]", {
        scale: 1.18,
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        "[data-fade]",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.12 },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Rotasi teks status.
  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen flex-col items-center justify-center gap-10 bg-canvas px-6"
    >
      {/* Orbit system */}
      <div className="relative h-40 w-40">
        <div
          data-orbit-slow
          className="absolute inset-0 rounded-full border border-dashed border-accent/30"
        >
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent" />
        </div>
        <div
          data-orbit-fast
          className="absolute inset-4 rounded-full border border-dashed border-primary/40"
        >
          <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-core
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary"
          >
            <QuizIcon className="h-9 w-9" />
          </div>
        </div>
      </div>

      {/* Teks */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 data-fade className="font-display text-2xl font-bold text-ink">
          AI is crafting your roadmap
        </h2>
        <p
          data-fade
          key={messageIndex}
          className="font-mono text-sm text-accent"
        >
          {STATUS_MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Progress bar shimmer */}
      <div
        data-fade
        className="h-1.5 w-64 max-w-full overflow-hidden rounded-full bg-elevate"
      >
        <div className="h-full w-1/2 rounded-full bg-primary animate-shimmer" />
      </div>
    </div>
  );
}

export default RoadmapLoader;
