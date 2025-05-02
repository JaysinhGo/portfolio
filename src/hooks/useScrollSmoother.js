import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export const useScrollSmoother = (smoothness = 1) => {
  useGSAP(() => {
    const smoother = ScrollSmoother.create({
      smooth: smoothness, // How long (in seconds) it takes to "catch up" to native scroll position
      effects: true, // Look for data-speed and data-lag attributes on elements
      normalizeScroll: true, // Prevents address bar from showing/hiding on most devices
    });

    return () => {
      smoother && smoother.kill();
    };
  }, [smoothness]);
};
