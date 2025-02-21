import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function ScrollIndicator() {
  const scrollContainerRef = useRef(null); // Scrolling area
  const svgRef = useRef(null); // SVG container
  const circleRef = useRef(null); // Moving dot
  const trackRectRef = useRef(null); // Track rectangle

  useGSAP(() => {
    const svg = svgRef.current;
    const circle = circleRef.current;
    const track = trackRectRef.current;
    const container = scrollContainerRef.current;

    if (!svg || !circle || !track || !container) return;

    gsap.set(svg, { transformOrigin: "center", scale: 1 });

    // Animate dot movement
    gsap.to(circle, {
      attr: { cy: 100 },
      opacity: 0.1,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Animate track height
    gsap.to(track, {
      height: 105,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });

    // Shrink SVG on scroll
    gsap.to(svg, {
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
      },
      scale: 0,
    });
  });

  return (
    <div ref={scrollContainerRef} className="relative w-screen h-[200vh]">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <svg
          ref={svgRef}
          width="40"
          height="90"
          viewBox="0 0 50 130"
          xmlns="http://www.w3.org/2000/svg"
          style={{ willChange: "transform" }} // GPU optimization
        >
          <rect
            ref={trackRectRef}
            className="fill-transparent stroke-[var(--scroll-indicator-fill)] stroke-[4px]"
            x="0"
            y="5"
            rx="25"
            ry="25"
            width="50"
            height="120"
          />
          <circle
            ref={circleRef}
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
