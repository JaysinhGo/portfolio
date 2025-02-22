import React, { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const getRandomHSL = () => {
  // More vibrant color ranges
  const hue = Math.random() * 360;
  const saturation = Math.random() * 20 + 80; // 80-100%
  const lightness = Math.random() * 30 + 55; // 55-85%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Optimized color generation
const getShiningColor = (index, progress) => {
  const hue = (index * 15 + progress * 1080) % 360;
  const shimmer = Math.sin(progress * Math.PI * 15) * 30;
  return `hsl(${hue}, 100%, ${55 + Math.sin(progress * Math.PI * 12) * 20}%)`;
};

const SpiralIntro = () => {
  const circles = useRef([]);
  const groupRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Memoize static arrays to prevent recalculation
  const { radius, dashArrays, transforms, opacities } = useMemo(
    () => ({
      radius: [
        16.5, 33, 49.5, 66, 82.5, 99, 115.5, 132, 148.5, 165, 181.5, 198, 214.5,
        231, 247.5, 264, 280.5, 297, 313.5, 330, 346.5, 363,
      ],
      dashArrays: [
        "0 104",
        "8 207",
        "25 311",
        "50 415",
        "84 518",
        "126 622",
        "176 726",
        "235 829",
        "302 933",
        "378 1037",
        "462 1140",
        "554 1244",
        "655 1348",
        "764 1451",
        "881 1555",
        "1007 1659",
        "1141 1762",
        "1284 1866",
        "1435 1970",
        "1595 2073",
        "1762 2177",
        "1939 2281",
      ],
      transforms: Array.from({ length: 22 }, (_, i) => i * 17),
      opacities: Array.from({ length: 22 }, (_, i) => 0.05 + i * 0.045),
    }),
    []
  );

  useGSAP(() => {
    // Animation phases
    const animations = {
      fadeIn: gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "0% top",
          end: "20% bottom",
          scrub: 1,
        },
      }),

      main: gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "10% top",
          end: "100% bottom",
          scrub: 0.3,
          onUpdate: (self) => {
            if (self.progress <= 0) return;

            requestAnimationFrame(() => {
              circles.current.forEach((circle, i) => {
                const progress = self.progress;
                const fastBreath =
                  Math.sin(progress * Math.PI * 5 + i * 0.1) * 0.05;
                const slowBreath =
                  Math.sin(progress * Math.PI * 2 + i * 0.1) * 0.15;

                gsap.to(circle, {
                  stroke: getShiningColor(i, progress),
                  attr: { r: radius[i] * (1 + fastBreath + slowBreath) },
                  strokeWidth: 1 + Math.abs(fastBreath + slowBreath) * 1.5,
                  duration: 0.1,
                  overwrite: "auto",
                });
              });
            });
          },
        },
      }),

      fadeOut: gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "80% top",
          end: "100% bottom",
          scrub: 1,
        },
      }),
    };

    // Setup animations
    circles.current.forEach((circle, i) => {
      animations.fadeIn.to(circle, { opacity: opacities[i] }, i * 0.05);
    });

    animations.main.to(groupRef.current, {
      rotation: 360 * 8,
      transformOrigin: "center center",
      ease: "none",
    });

    [...circles.current].reverse().forEach((circle, i) => {
      animations.fadeOut.to(circle, { opacity: 0 }, i * 0.05);
    });

    return () => {
      Object.values(animations).forEach((tl) => tl.kill());
    };
  }, [opacities, radius]);

  return (
    <div ref={scrollContainerRef} className="relative w-screen h-[1200vh]">
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 1000 1000"
          style={{
            width: "min(100vw, 100vh)",
            height: "min(100vw, 100vh)",
            maxWidth: "900px",
            maxHeight: "900px",
          }}
          preserveAspectRatio="xMidYMid meet"
          overflow="visible"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="cccoil-grad"
            >
              <stop
                stopColor="hsl(206, 75%, 49%)"
                stopOpacity="1"
                offset="0%"
              />
              <stop
                stopColor="hsl(331, 90%, 56%)"
                stopOpacity="1"
                offset="100%"
              />
            </linearGradient>
          </defs>
          <g
            ref={groupRef}
            stroke="url(#cccoil-grad)"
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
          >
            {radius.map((r, i) => (
              <circle
                key={i}
                ref={(el) => (circles.current[i] = el)}
                r={r}
                cx="400"
                cy="400"
                strokeWidth="1"
                strokeDasharray={dashArrays[i]}
                transform={`rotate(${transforms[i]}, 400, 400)`}
                opacity="0"
                stroke={getRandomHSL()}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SpiralIntro;
