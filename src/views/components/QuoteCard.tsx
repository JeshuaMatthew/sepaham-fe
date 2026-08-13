import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { DevQuote } from "@/features/home/types/ai";

interface QuoteCardProps {
  quotes: DevQuote[];
}

function QuoteCard({ quotes }: QuoteCardProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const quote = quotes[0];

  // Fade-in saat pertama render.
  useEffect(() => {
    gsap.fromTo(
      bodyRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );
  }, []);

  return (
    <div className="flex flex-col justify-center gap-2 rounded-card p-6">
      <div ref={bodyRef} className="flex flex-col gap-2">
        <p className="font-display text-xl font-semibold leading-snug text-ink">
          “{quote.text}”
        </p>
        <p className="text-sm text-muted">— {quote.author}</p>
      </div>
    </div>
  );
}

export default QuoteCard;
