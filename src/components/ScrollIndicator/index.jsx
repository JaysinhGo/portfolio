import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function ScrollIndicator() {
  // Store refs for elements
  const refs = {
    trigger: useRef(null),
    container: useRef(null),
    indicator: useRef(null),
    track: useRef(null),
  };

  useGSAP(() => {
    const { trigger, container, indicator, track } = refs;

    // Shrink SVG on scroll
    gsap.to(container.current, {
      scrollTrigger: {
        trigger: trigger.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      scale: 0,
    });

    // Animate the moving circle
    gsap.to(indicator.current, {
      attr: { cy: 100 },
      opacity: 0.1,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Animate track height pulsing
    gsap.to(track.current, {
      height: 105,
      duration: 1.4,
      delay: 0.3,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });
  });

  return (
    <div ref={refs.trigger} className="relative w-full h-[200vh]">
      <div
        ref={refs.container}
        className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <svg
          width="40"
          height="90"
          viewBox="0 0 50 130"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            ref={refs.track}
            className="fill-transparent stroke-[var(--scroll-indicator-fill)] stroke-[4px]"
            x="0"
            y="5"
            rx="25"
            ry="25"
            width="50"
            height="120"
          />
          <circle
            ref={refs.indicator}
            className="fill-[var(--scroll-indicator-fill)]"
            cx="25"
            cy="32"
            r="8"
          />
        </svg>
      </div>
    </div>
  );
}

export default ScrollIndicator;
