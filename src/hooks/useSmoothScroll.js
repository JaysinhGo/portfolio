import { useEffect, useRef } from "react";

export const useSmoothScroll = (smoothness = 0.1) => {
  const targetY = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    // Track current scroll position
    const handleScroll = () => {
      targetY.current = window.scrollY;
    };

    // Smooth animation function
    const animate = () => {
      // Calculate distance between current and target position
      const diff = targetY.current - currentY.current;

      // Smoothly update current position
      currentY.current += diff * smoothness;

      // Apply the transform
      window.scrollTo(0, Math.round(currentY.current));

      // Continue animation
      rafId.current = requestAnimationFrame(animate);
    };

    // Start animation
    rafId.current = requestAnimationFrame(animate);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [smoothness]);
};
