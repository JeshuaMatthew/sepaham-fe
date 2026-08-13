import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  selector?: string;
  delay?: number;
  stagger?: number;
}

/**
 * A wrapper component that applies a staggered entrance animation
 * to its children elements (e.g. lists, grids).
 */
export default function StaggerContainer({
  children,
  className = "",
  selector = "[data-animate]",
  delay = 0,
  stagger = 0.05,
}: StaggerContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(selector,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: stagger,
          ease: "power3.out",
          delay: delay,
          clearProps: "all",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [selector, delay, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
