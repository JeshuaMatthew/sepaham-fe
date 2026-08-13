import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * A wrapper component that applies a smooth entrance animation
 * (fade in + slight slide up) when the page or component mounts.
 */
export default function PageTransition({ children, className = "", delay = 0 }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          delay: delay,
          clearProps: "all",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
