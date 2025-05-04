import React, { useRef, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Constants
const CIRCLE_COUNT = 31;
const MAX_RADIUS = 800;
const GRADIENT_STOPS = 5;
const TEXT_ANIMATION_CONFIG = {
  lines: [
    { start: 0.2, peak: 0.3, end: 0.6 },
    { start: 0.3, peak: 0.4, end: 0.7 },
    { start: 0.4, peak: 0.5, end: 0.8 },
    { start: 0.5, peak: 0.6, end: 0.9 },
  ],
};

// Color generation utilities
const createHSLColor = (hue, saturation, lightness) =>
  `hsl(${hue}, ${saturation}%, ${lightness}%)`;

// Generate random HSL color with optional hue offset
const generateRandomHSL = (offset = 0) => {
  const hue = (Math.random() * 360 + offset) % 360;
  const saturation = Math.random() * 20 + 80;
  const lightness = Math.random() * 30 + 45;
  return createHSLColor(hue, saturation, lightness);
};

// Color harmony schemes for gradient generation
const COLOR_SCHEMES = {
  complementary: (hue) => (hue + 180) % 360,
  triadic: (hue) => (hue + 120) % 360,
  splitComplementary: (hue) => (hue + (Math.random() > 0.5 ? 150 : 210)) % 360,
};

// Generate harmonious color based on input hue
const generateHarmonicHSL = (baseHue) => {
  const schemes = Object.values(COLOR_SCHEMES);
  const selectedScheme = schemes[Math.floor(Math.random() * schemes.length)];
  const hue = selectedScheme(baseHue);
  return createHSLColor(hue, Math.random() * 20 + 80, Math.random() * 30 + 45);
};

// Smooth easing function for animations
const calculateEasing = (min, max, value) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

// Generate SVG gradient stops with dynamic colors and opacity
const generateGradientStops = (numStops = GRADIENT_STOPS, progress = 0) => {
  const baseHue = progress * 2160;

  return Array.from({ length: numStops }, (_, i) => {
    const offset = (i / (numStops - 1)) * 100;
    const hueOffset =
      (i * 90 + baseHue + Math.sin(progress * Math.PI * 4) * 90) % 360;
    const useHarmonic = Math.sin(progress * Math.PI * 4 + i + progress) > 0;
    const shimmer = Math.sin(progress * Math.PI * 6 + i) * 0.1;

    // Return a React element instead of an object
    return (
      <stop
        key={i}
        offset={`${offset}%`}
        stopColor={
          useHarmonic
            ? generateHarmonicHSL(hueOffset)
            : generateRandomHSL(hueOffset)
        }
        stopOpacity={
          0.8 + shimmer + Math.sin(progress * Math.PI * 2 + i) * 0.15
        }
      />
    );
  });
};

// Generate CSS gradient string for text effects
const createGradientStyle = (progress) => {
  const stops = Array.from({ length: GRADIENT_STOPS }, (_, i) => {
    const offset = (i / (GRADIENT_STOPS - 1)) * 100;
    const hueOffset =
      (i * 90 + progress * 2160 + Math.sin(progress * Math.PI * 4) * 90) % 360;
    const useHarmonic = Math.sin(progress * Math.PI * 4 + i + progress) > 0;
    const color = useHarmonic
      ? generateHarmonicHSL(hueOffset)
      : generateRandomHSL(hueOffset);
    return `${color} ${offset}%`;
  });

  const angle = progress * 360;
  return `linear-gradient(${angle}deg, ${stops.join(", ")})`;
};

// Main component that renders an animated sphere made of circles
const PranaSphere = () => {
  // Track DOM elements for animations
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const circleGroups = useRef({
    left: [],
    right: [],
    top: [],
    bottom: [],
  }).current;
  const textElements = useRef([]);
  const highlightedText = useRef([]);

  // Pre-calculate circle properties to avoid runtime calculations
  const circleProperties = useMemo(() => {
    const step = MAX_RADIUS / CIRCLE_COUNT;
    return Array.from({ length: CIRCLE_COUNT }, (_, i) => ({
      radius: MAX_RADIUS - i * step,
      index: i,
      total: CIRCLE_COUNT,
      reverseIndex: CIRCLE_COUNT - 1 - i,
      normalizedIndex: i / CIRCLE_COUNT,
    }));
  }, []);

  // Generate unique IDs for SVG gradients
  const gradientIds = useMemo(
    () => Array.from({ length: 4 }, (_, i) => `sphere-gradient-${i + 1}`),
    []
  );

  // Calculate wave effects for circle animations
  const calculateWaveEffects = useCallback(
    (progress, index, normalizedIndex) => {
      const twoPI = Math.PI * 2;
      return {
        primary: Math.sin(progress * twoPI * 6 + index * 0.3) * 0.85,
        quick: Math.sin(progress * twoPI * 8 + index * 0.2) * 0.4,
        micro: Math.sin(progress * twoPI * 12 + index * 0.1) * 0.2,
        pulse: Math.sin(progress * twoPI * 3) * 0.3,
      };
    },
    []
  );

  // Set up main scroll-based animation
  useGSAP(() => {
    // Initial hide function
    const hideAll = () => {
      gsap.set(svgRef.current, { opacity: 0 });
      Object.values(circleGroups).forEach((group) =>
        group.forEach((circle) =>
          gsap.set(circle, {
            opacity: 0,
            scale: 0.1,
            transformOrigin: "center center",
          })
        )
      );
    };

    // Set initial state
    hideAll();

    // ScrollTrigger animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Force hide state when scrolled above start point
          if (progress <= 0) {
            hideAll();
            return;
          }

          // Rest of your existing animation code...
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
                    ? generateHarmonicHSL(hueOffset)
                    : generateRandomHSL(hueOffset)
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

              circleProperties.forEach((data, idx) => {
                const circle = circleGroups[position][idx];
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
                  const waves = calculateWaveEffects(
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
                        (1 - (reverseIndex / circleProperties.length) * 0.75) *
                        calculateEasing(0, 1, visibilityProgress) *
                        calculateEasing(1, 0, exitProgress),
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
        onLeave: hideAll, // Hide when scrolled past
        onEnterBack: () => {
          // Ensure visibility when scrolling back
          gsap.set(svgRef.current, { opacity: 1 });
        },
      },
    });

    return () => {
      tl.kill();
      hideAll();
    };
  }, [circleProperties, calculateWaveEffects, gradientIds]);

  // Set up text animation with word-by-word reveal
  useGSAP(() => {
    const words = textElements.current;
    const highlighted = highlightedText.current;

    gsap.set(words, {
      opacity: 0,
      y: 50,
      rotationX: -90,
    });

    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "90% bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          words.forEach((word, i) => {
            const lineIndex = Math.floor(i / 5);
            const wordInLineIndex = i % 5;
            const line = TEXT_ANIMATION_CONFIG.lines[lineIndex];

            if (!line) return;

            const wordDelay = wordInLineIndex * 0.02;
            const wordStart = line.start + wordDelay;
            const wordPeak = line.peak + wordDelay;
            const wordEnd = line.end + wordDelay;

            let opacity = 0;
            let y = 50;
            let rotationX = -90;

            if (progress < wordStart) {
              opacity = 0;
              y = 50;
              rotationX = -90;
            } else if (progress < wordPeak) {
              const entryProgress =
                (progress - wordStart) / (wordPeak - wordStart);
              opacity = entryProgress;
              y = 50 * (1 - entryProgress);
              rotationX = -90 * (1 - entryProgress);
            } else if (progress < wordEnd) {
              opacity = 1;
              y = 0;
              rotationX = 0;
            } else {
              const exitProgress = (progress - wordEnd) / 0.1;
              opacity = 1 - exitProgress;
              y = -50 * exitProgress;
              rotationX = 90 * exitProgress;
            }

            gsap.to(word, {
              opacity,
              y,
              rotationX,
              duration: 0.2,
              ease: "power2.inOut",
            });

            // Update gradient for highlighted words
            if (highlighted[i]) {
              gsap.to(highlighted[i], {
                backgroundImage: createGradientStyle(progress),
                duration: 0.2,
                ease: "none",
              });
            }
          });
        },
      },
    });

    return () => textTl.kill();
  }, []);

  // Render SVG with circles and gradients
  return (
    <div ref={containerRef} className="relative w-screen h-[500vh]">
      <div className="fixed inset-0 flex items-center justify-center">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-800 -800 3200 3200"
          className="w-full h-full max-w-[150vw] max-h-[150vh]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {gradientIds.map((id, index) => (
              <linearGradient
                key={id}
                id={id}
                x1={index % 2 ? "100%" : "0%"}
                y1={index < 2 ? "0%" : "100%"}
                x2={index % 2 ? "0%" : "100%"}
                y2={index < 2 ? "100%" : "0%"}
                gradientTransform={`rotate(${45 + index * 90})`}
                spreadMethod="reflect"
              >
                {generateGradientStops(GRADIENT_STOPS, 0)}
              </linearGradient>
            ))}
          </defs>

          {/* Left circles */}
          <g strokeWidth="2" stroke={`url(#sphere-gradient-1)`} fill="none">
            {circleProperties.map((data, i) => {
              const reverseIndex = circleProperties.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleProperties.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity =
                1 - (reverseIndex / circleProperties.length) * 0.75;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`left-${i}`}
                  ref={(el) => (circleGroups.left[i] = el)}
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
          <g strokeWidth="2" stroke={`url(#sphere-gradient-2)`} fill="none">
            {circleProperties.map((data, i) => {
              const reverseIndex = circleProperties.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleProperties.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity =
                1 - (reverseIndex / circleProperties.length) * 0.8;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`right-${i}`}
                  ref={(el) => (circleGroups.right[i] = el)}
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
          <g strokeWidth="2" stroke={`url(#sphere-gradient-3)`} fill="none">
            {circleProperties.map((data, i) => {
              const reverseIndex = circleProperties.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleProperties.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity =
                1 - (reverseIndex / circleProperties.length) * 0.8;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`top-${i}`}
                  ref={(el) => (circleGroups.top[i] = el)}
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
          <g strokeWidth="2" stroke={`url(#sphere-gradient-4)`} fill="none">
            {circleProperties.map((data, i) => {
              const reverseIndex = circleProperties.length - 1 - i;
              const circumference = 2 * Math.PI * data.radius;
              const dashSize =
                Math.pow(reverseIndex / circleProperties.length, 2) * 100;
              const strokeDasharray =
                reverseIndex < 10 ? "none" : `${dashSize} ${dashSize * 0.5}`;

              // Adjusted opacity calculation - inner circles more opaque (1), outer circles at 0.35
              const baseOpacity =
                1 - (reverseIndex / circleProperties.length) * 0.8;
              // This will make inner circles fully opaque (1) and outer circles at 0.35

              return (
                <circle
                  key={`bottom-${i}`}
                  ref={(el) => (circleGroups.bottom[i] = el)}
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

        {/* Text overlay with improved mobile responsiveness */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[95vw] max-w-[1000px] z-10 p-4 sm:p-8 [perspective:1000px]">
          {/* Text line container with improved spacing */}
          <div className="relative my-2 sm:my-4 min-h-[1.5em] overflow-visible [transform-style:preserve-3d]">
            {/* Update text size classes for better mobile scaling */}
            <span
              ref={(el) => (textElements.current[0] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              I
            </span>
            <span
              ref={(el) => (textElements.current[1] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              enjoy
            </span>
            <span
              ref={(el) => (textElements.current[2] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              crafting
            </span>
            <span
              ref={(el) => (textElements.current[3] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              <span
                ref={(el) => (highlightedText.current[3] = el)}
                className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
              >
                seamless
              </span>
            </span>
            <span
              ref={(el) => (textElements.current[4] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              and
            </span>
          </div>
          <div className="relative my-2 sm:my-4 min-h-[1.5em] overflow-visible [transform-style:preserve-3d]">
            <span
              ref={(el) => (textElements.current[5] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              <span
                ref={(el) => (highlightedText.current[5] = el)}
                className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
              >
                captivating
              </span>
            </span>
            <span
              ref={(el) => (textElements.current[6] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              digital
            </span>
            <span
              ref={(el) => (textElements.current[7] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              experiences,
            </span>
          </div>
          <div className="relative my-2 sm:my-4 min-h-[1.5em] overflow-visible [transform-style:preserve-3d]">
            <span
              ref={(el) => (textElements.current[8] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              combining
            </span>
            <span
              ref={(el) => (textElements.current[9] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              <span
                ref={(el) => (highlightedText.current[9] = el)}
                className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
              >
                functionality
              </span>
            </span>
            <span
              ref={(el) => (textElements.current[10] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              with
            </span>
          </div>
          <div className="relative my-2 sm:my-4 min-h-[1.5em] overflow-visible [transform-style:preserve-3d]">
            <span
              ref={(el) => (textElements.current[11] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              <span
                ref={(el) => (highlightedText.current[11] = el)}
                className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
              >
                stunning
              </span>
            </span>
            <span
              ref={(el) => (textElements.current[12] = el)}
              className="inline-block text-[clamp(1.2rem,4vw,2.5rem)] font-medium text-white mx-1 sm:mx-1.5 [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              <span
                ref={(el) => (highlightedText.current[12] = el)}
                className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
              >
                design.
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PranaSphere;
