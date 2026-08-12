import { useEffect, useRef } from "react";
import gsap from "gsap";

type HoverOptions = {
  scale?: number;
  y?: number;
  durationIn?: number;
  durationOut?: number;
};

/**
 * Hook to apply smooth GSAP hover animations (scale and/or translateY)
 * to an element. Returns a ref to attach to the target element.
 */
export function useGsapHover<T extends HTMLElement>(options: HoverOptions = {}) {
  const ref = useRef<T>(null);
  
  const {
    scale = 1.02,
    y = -4,
    durationIn = 0.28,
    durationOut = 0.32,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx = gsap.context(() => {
      // Cleanup any existing listeners
      const onEnter = () => {
        gsap.to(el, { 
          scale: options.scale !== undefined ? scale : 1, 
          y: options.y !== undefined ? y : 0, 
          duration: durationIn, 
          ease: "power3.out",
          overwrite: "auto"
        });
      };

      const onLeave = () => {
        gsap.to(el, { 
          scale: 1, 
          y: 0, 
          duration: durationOut, 
          ease: "power3.out",
          overwrite: "auto"
        });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    }, ref);

    return () => ctx.revert();
  }, [scale, y, durationIn, durationOut, options.scale, options.y]);

  return ref;
}
