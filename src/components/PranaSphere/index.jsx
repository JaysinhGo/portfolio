import React, { useRef, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Helper function for smooth transitions
const smoothstep = (min, max, value) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

// Color generation functions for gradients
const getRandomHSL = (offset = 0) => {
  const hue = (Math.random() * 360 + offset) % 360;
  const saturation = Math.random() * 20 + 80; // High saturation
  const lightness = Math.random() * 30 + 45; // Mid-range lightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const getComplementaryHSL = (baseHue) => {
  // Color schemes for complementary colors
  const schemes = {
    complementary: (h) => (h + 180) % 360,
    triadic: (h) => (h + 120) % 360,
    split: (h) => (h + (Math.random() > 0.5 ? 150 : 210)) % 360,
  };
  const scheme = Object.values(schemes)[Math.floor(Math.random() * 3)];
  const hue = scheme(baseHue);
  return `hsl(${hue}, ${Math.random() * 20 + 80}%, ${
    Math.random() * 30 + 45
  }%)`;
};

const getMultiColorGradient = (numStops = 5, progress = 0) => {
  const stops = [];
  const baseHue = progress * 2160;

  for (let i = 0; i < numStops; i++) {
    const offset = (i / (numStops - 1)) * 100;
    const hueOffset =
      (i * 90 + baseHue + Math.sin(progress * Math.PI * 4) * 90) % 360;
    const useComplement = Math.sin(progress * Math.PI * 4 + i + progress) > 0;

    const color = useComplement
      ? getComplementaryHSL(hueOffset)
      : getRandomHSL(hueOffset);

    const shimmer = Math.sin(progress * Math.PI * 6 + i) * 0.1;

    stops.push(
      <stop
        key={i}
        stopColor={color}
        stopOpacity={
          0.8 + shimmer + Math.sin(progress * Math.PI * 2 + i) * 0.15
        }
        offset={`${offset}%`}
      />
    );
  }
  return stops;
};

const PranaSphere = () => {
  // Refs for animation targets
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const circleRefs = useRef({
    left: [],
    right: [],
    top: [],
    bottom: [],
  }).current;

  // Generate circle dimensions and properties
  const circleData = useMemo(() => {
    const count = 31;
    const maxRadius = 800;
    const step = maxRadius / count;
    return Array.from({ length: count }, (_, i) => ({
      radius: maxRadius - i * step,
      index: i,
      total: count,
      reverseIndex: count - 1 - i,
      normalizedIndex: i / count,
    }));
  }, []);

  // Wave calculation for circle animations
  const calculateWaves = useCallback((activeProgress, idx, normalizedIndex) => {
    const twoPI = Math.PI * 2;
    return {
      primary: Math.sin(activeProgress * twoPI * 6 + idx * 0.3) * 0.85,
      quick: Math.sin(activeProgress * twoPI * 8 + idx * 0.2) * 0.4,
      micro: Math.sin(activeProgress * twoPI * 12 + idx * 0.1) * 0.2,
      pulse: Math.sin(activeProgress * twoPI * 3) * 0.3,
    };
  }, []);

  // Memoize gradient IDs
  const gradientIds = useMemo(
    () => [
      "rrreflection-grad",
      "rrreflection-grad-2",
      "rrreflection-grad-3",
      "rrreflection-grad-4",
    ],
    []
  );

  // Main animation setup
  useGSAP(() => {
    const hideAll = () => {
      gsap.set(svgRef.current, { opacity: 0 });
      Object.values(circleRefs).forEach((group) =>
        group.forEach((circle) =>
          gsap.set(circle, {
            opacity: 0,
            scale: 0.1,
            transformOrigin: "center center",
          })
        )
      );
    };

    hideAll();

    // ScrollTrigger animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "-20% top", // Start slightly before element enters viewport
        end: "80% bottom", // End slightly before element leaves viewport
        scrub: true, // Smooth scrubbing
        onUpdate: (self) => {
          const progress = self.progress;

          // Fade out component near the end
          const componentOpacity = gsap.utils.clamp(
            0,
            1,
            1 - Math.max(0, (progress - 0.8) * 5)
          );
          gsap.set(svgRef.current, { opacity: componentOpacity });

          // Batch animations for performance
          requestAnimationFrame(() => {
            // Update gradients
            gradientIds.forEach((id, index) => {
              const gradient = document.getElementById(id);
              if (!gradient) return;

              // Update gradient colors
              while (gradient.firstChild) {
                gradient.removeChild(gradient.firstChild);
              }

              const baseHue = progress * 2160 + index * 90;
              for (let i = 0; i < 5; i++) {
                const offset = (i / 4) * 100;
                const hueOffset =
                  (i * 90 + baseHue + Math.sin(progress * Math.PI * 4) * 90) %
                  360;
                const useComplement =
                  Math.sin(progress * Math.PI * 4 + i + index) > 0;
                const shimmer = Math.sin(progress * Math.PI * 6 + i) * 0.1;
                const stopOpacity =
                  0.8 + shimmer + Math.sin(progress * Math.PI * 2 + i) * 0.15;

                const stop = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "stop"
                );
                stop.setAttribute("offset", `${offset}%`);
                stop.setAttribute(
                  "stop-color",
                  useComplement
                    ? getComplementaryHSL(hueOffset)
                    : getRandomHSL(hueOffset)
                );
                stop.setAttribute("stop-opacity", stopOpacity);
                gradient.appendChild(stop);
              }

              const rotation =
                progress * 540 +
                index * 90 +
                Math.sin(progress * Math.PI * 2) * 45;
              gradient.setAttribute(
                "gradientTransform",
                `rotate(${rotation}, 0.5, 0.5)`
              );
            });

            // Update circles with batched animations
            ["left", "right", "top", "bottom"].forEach((position) => {
              const updates = [];

              circleData.forEach((data, idx) => {
                const circle = circleRefs[position][idx];
                if (!circle) return;

                const { normalizedIndex, reverseIndex } = data;
                const visibilityProgress = gsap.utils.clamp(
                  0,
                  1,
                  (progress - normalizedIndex * 0.02) * 4
                );
                const exitProgress = gsap.utils.clamp(
                  0,
                  1,
                  (progress - 0.7 - normalizedIndex * 0.02) * 5
                );

                if (visibilityProgress > 0 && exitProgress < 1) {
                  const activeProgress = (progress - 0.2) / 0.6;
                  const waves = calculateWaves(
                    activeProgress,
                    idx,
                    normalizedIndex
                  );
                  const combinedWave = Object.values(waves).reduce(
                    (a, b) => a + b,
                    0
                  );

                  updates.push(() => {
                    gsap.to(circle, {
                      opacity:
                        (1 - (reverseIndex / circleData.length) * 0.75) *
                        smoothstep(0, 1, visibilityProgress) *
                        smoothstep(1, 0, exitProgress),
                      scale:
                        (0.1 +
                          visibilityProgress * 1.6 +
                          (visibilityProgress > 0.6 ? combinedWave : 0)) *
                        (1 - exitProgress * 0.9),
                      rotate:
                        progress * 720 * (1 - normalizedIndex * 0.6) +
                        combinedWave * 15,
                      duration: 0.3,
                      ease: "power2.out",
                      overwrite: "auto",
                    });
                  });
                }
              });

              // Execute batched updates
              gsap.to(
                {},
                {
                  duration: 0.1,
                  onComplete: () => updates.forEach((update) => update()),
                }
              );
            });
          });
        },
      },
    });

    return () => {
      tl.kill();
      hideAll();
    };
  }, [circleData, calculateWaves, gradientIds]);

  // Render SVG with circles and gradients
  return (
    <div ref={containerRef} className="relative w-screen h-[2000vh]">
      <div className="fixed inset-0 flex items-center justify-center">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-800 -800 3200 3200"
          className="w-full h-full max-w-[150vw] max-h-[150vh]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gradients */}
          <defs>
            <linearGradient
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              id="rrreflection-grad"
              gradientTransform="rotate(45)"
              spreadMethod="reflect"
            >
              {getMultiColorGradient(5)}
            </linearGradient>

            <linearGradient
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
              id="rrreflection-grad-2"
              gradientTransform="rotate(-45)"
              spreadMethod="reflect"
            >
              {getMultiColorGradient(5)}
            </linearGradient>

            <linearGradient
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
              id="rrreflection-grad-3"
              gradientTransform="rotate(135)"
              spreadMethod="reflect"
            >
              {getMultiColorGradient(5)}
            </linearGradient>

            <linearGradient
              x1="100%"
              y1="100%"
              x2="0%"
              y2="0%"
              id="rrreflection-grad-4"
              gradientTransform="rotate(-135)"
              spreadMethod="reflect"
            >
              {getMultiColorGradient(5)}
            </linearGradient>
          </defs>

          {/* Left circles */}
          <g strokeWidth="2" stroke="url(#rrreflection-grad)" fill="none">
            {circleData.map((data, i) => {
              const reverseIndex = circleData.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleData.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity = 1 - (reverseIndex / circleData.length) * 0.75;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`left-${i}`}
                  ref={(el) => (circleRefs.left[i] = el)}
                  r={data.radius}
                  cx="-800"
                  cy="800"
                  strokeDasharray={strokeDasharray}
                  strokeOpacity={baseOpacity}
                  data-position="left"
                  data-index={i}
                  data-total="31"
                />
              );
            })}
          </g>

          {/* Right circles */}
          <g strokeWidth="2" stroke="url(#rrreflection-grad-2)" fill="none">
            {circleData.map((data, i) => {
              const reverseIndex = circleData.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleData.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity = 1 - (reverseIndex / circleData.length) * 0.8;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`right-${i}`}
                  ref={(el) => (circleRefs.right[i] = el)}
                  r={data.radius}
                  cx="2400"
                  cy="800"
                  strokeDasharray={strokeDasharray}
                  strokeOpacity={baseOpacity}
                  data-position="right"
                  data-index={i}
                  data-total="31"
                />
              );
            })}
          </g>

          {/* Top circles */}
          <g strokeWidth="2" stroke="url(#rrreflection-grad-3)" fill="none">
            {circleData.map((data, i) => {
              const reverseIndex = circleData.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleData.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity = 1 - (reverseIndex / circleData.length) * 0.8;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`top-${i}`}
                  ref={(el) => (circleRefs.top[i] = el)}
                  r={data.radius}
                  cx="800"
                  cy="-800"
                  strokeDasharray={strokeDasharray}
                  strokeOpacity={baseOpacity}
                  data-position="top"
                  data-index={i}
                  data-total="31"
                />
              );
            })}
          </g>

          {/* Bottom circles */}
          <g strokeWidth="2" stroke="url(#rrreflection-grad-4)" fill="none">
            {circleData.map((data, i) => {
              const reverseIndex = circleData.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleData.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity = 1 - (reverseIndex / circleData.length) * 0.8;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`bottom-${i}`}
                  ref={(el) => (circleRefs.bottom[i] = el)}
                  r={data.radius}
                  cx="800"
                  cy="2400"
                  strokeDasharray={strokeDasharray}
                  strokeOpacity={baseOpacity}
                  data-position="bottom"
                  data-index={i}
                  data-total="31"
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default PranaSphere;
