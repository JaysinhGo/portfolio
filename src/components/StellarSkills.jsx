import React, { useRef, useMemo, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SkillAsteroid from "./SkillAsteroid";
import { ASTEROID_CONFIGS } from "./asteroidConfigs.jsx";

gsap.registerPlugin(ScrollTrigger);

// Asteroid configurations are now imported as ASTEROID_CONFIGS

const StellarSkills = () => {
  const containerRef = useRef(null);
  const asteroidRefs = useRef({});
  const textElements = useRef([]);
  const highlightedText = useRef([]);
  const [asteroidSizes, setAsteroidSizes] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollingActive, setIsScrollingActive] = useState(false);
  const [isScrollingBackward, setIsScrollingBackward] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const lastScrollProgress = useRef(0);
  const animationFrameRef = useRef(null);

  // Text animation configuration - first half of container scroll only
  const TEXT_ANIMATION_CONFIG = {
    lines: [
      { start: 0.0, peak: 0.25, end: 0.5 }, // First half of container scroll
    ],
  };

  // Create gradient style for highlighted text
  const createGradientStyle = (progress) => {
    const hue = (progress * 720) % 360;
    return `linear-gradient(${progress * 720}deg, 
      hsl(${hue}, 100%, 50%) 0%, 
      hsl(${(hue + 120) % 360}, 100%, 50%) 50%, 
      hsl(${(hue + 240) % 360}, 100%, 50%) 100%)`;
  };

  // Memoize asteroid configurations to avoid recalculation
  const asteroidEntries = useMemo(() => Object.entries(ASTEROID_CONFIGS), []);

  // Memoize viewport dimensions
  const viewportDimensions = useMemo(
    () => ({
      maxTop: window.innerHeight + 350,
      maxRight: window.innerWidth + 350,
    }),
    []
  );

  // Optimized scroll handler with throttling
  const handleScrollUpdate = useCallback(
    (progress) => {
      const previousProgress = lastScrollProgress.current;

      // Update scroll progress for ray animations
      setScrollProgress(progress);

      // Detect scroll direction
      if (progress > previousProgress) {
        setIsScrollingBackward(false);
      } else if (progress < previousProgress) {
        setIsScrollingBackward(true);
      }

      lastScrollProgress.current = progress;

      // Set scrolling as active
      setIsScrollingActive(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to mark scrolling as inactive after 100ms
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrollingActive(false);
      }, 100);

      // Only animate if container is visible
      if (progress <= 0 || progress >= 1) return;

      // Use requestAnimationFrame for smooth updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        // Calculate new sizes for all asteroids
        const newSizes = {};

        // Speed multiplier - increase this value to make movement faster
        const speedMultiplier = 4; // Increased from 1.0 to 2.5

        asteroidEntries.forEach(([tech, config]) => {
          const asteroid = asteroidRefs.current[tech];
          if (!asteroid) return;

          // Calculate progress with delay and speed multiplier
          const techProgress = Math.max(
            0,
            progress * speedMultiplier - config.delay
          );

          // Calculate position with increased speed
          const top =
            techProgress * viewportDimensions.maxTop + config.startTop;
          const right =
            techProgress * viewportDimensions.maxRight + config.startRight;

          // Calculate size
          const size = Math.round(techProgress * config.maxSize);
          newSizes[tech] = size;

          // Update position using GSAP for better performance
          gsap.set(asteroid, {
            top: top,
            right: right,
            left: "auto",
            duration: 0.1,
            ease: "none",
            overwrite: "auto",
          });
        });

        // Batch update all asteroid sizes
        setAsteroidSizes(newSizes);
      });
    },
    [asteroidEntries, viewportDimensions]
  );

  useGSAP(() => {
    const container = containerRef.current;
    const words = textElements.current.filter(Boolean);
    const highlighted = highlightedText.current.filter(Boolean);
    if (!container) return;

    // Set initial state - hidden
    gsap.set(container, { opacity: 0 });

    // Set initial state for text elements
    gsap.set(words, {
      opacity: 0,
      y: 100,
      rotationX: -90,
      scale: 0.8,
      transformOrigin: "center center",
    });

    // Set initial positions for all asteroids
    asteroidEntries.forEach(([tech, config]) => {
      const asteroid = asteroidRefs.current[tech];
      if (asteroid) {
        gsap.set(asteroid, {
          top: config.startTop,
          right: config.startRight,
          left: "auto",
        });
      }
    });

    // Create text animation timeline for first half of container scroll only
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "50% top", // First half of container scroll
        scrub: 0.3,
        onLeave: () => {
          gsap.to(words, {
            opacity: 0,
            y: -50,
            rotationX: 90,
            scale: 0.8,
            duration: 0.3,
            stagger: {
              amount: 0.2,
              from: "start",
            },
            ease: "power2.in",
          });
        },
        onEnterBack: () => {
          gsap.to(words, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.3,
            stagger: {
              amount: 0.2,
              from: "end",
            },
            ease: "power2.out",
          });
        },
        onUpdate: (self) => {
          const progress = self.progress;

          words.forEach((word, i) => {
            const lineIndex = 0; // Only one line for this message
            const wordInLineIndex = i; // Use actual word index
            const line = TEXT_ANIMATION_CONFIG.lines[lineIndex];

            if (!line) return;

            const wordDelay = wordInLineIndex * 0.04;
            const wordStart = line.start + wordDelay;
            const wordPeak = line.peak + wordDelay;
            const wordEnd = line.end + wordDelay;

            let opacity = 0;
            let y = 100;
            let rotationX = -90;
            let scale = 0.8;

            if (progress < wordStart) {
              opacity = 0;
              y = 100;
              rotationX = -90;
              scale = 0.8;
            } else if (progress < wordPeak) {
              const entryProgress =
                (progress - wordStart) / (wordPeak - wordStart);
              const easeProgress = gsap.parseEase("power2.out")(entryProgress);
              opacity = easeProgress;
              y = 100 * (1 - easeProgress);
              rotationX = -90 * (1 - easeProgress);
              scale = 0.8 + 0.2 * easeProgress;
            } else if (progress < wordEnd) {
              opacity = 1;
              y = 0;
              rotationX = 0;
              scale = 1;
            } else {
              const exitProgress = (progress - wordEnd) / 0.1;
              const easeExitProgress =
                gsap.parseEase("power2.in")(exitProgress);
              opacity = Math.max(0, 1 - easeExitProgress);
              y = -50 * easeExitProgress;
              rotationX = 90 * easeExitProgress;
              scale = 1 - 0.2 * easeExitProgress;
            }

            gsap.to(word, {
              opacity,
              y,
              rotationX,
              scale,
              duration: 0.2,
              ease: "power2.inOut",
            });

            if (highlighted[i]) {
              gsap.to(highlighted[i], {
                backgroundImage: createGradientStyle(progress * 2),
                duration: 0.1,
                ease: "none",
              });
            }
          });
        },
      },
    });

    // Visibility animation
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play reverse play reverse",
      onEnter: () => {
        gsap.to(container, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      },
      onLeave: () => {
        gsap.to(container, {
          opacity: 0,
          duration: 0.1,
          ease: "power2.in",
        });
      },
      onEnterBack: () => {
        gsap.to(container, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(container, {
          opacity: 0,
          duration: 0.1,
          ease: "power2.in",
        });
      },
    });

    // Diagonal movement animation - only when container is visible
    gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          handleScrollUpdate(self.progress);
        },
      },
    });

    return () => textTl.kill();
  }, [asteroidEntries, handleScrollUpdate]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Memoize asteroid components to prevent unnecessary re-renders
  const asteroidComponents = useMemo(
    () =>
      asteroidEntries.map(([tech, config]) => (
        <div
          key={tech}
          ref={(el) => (asteroidRefs.current[tech] = el)}
          className="absolute"
          style={{
            top: config.startTop,
            right: config.startRight,
          }}
        >
          <SkillAsteroid
            technology={tech}
            width={asteroidSizes[tech] || 0}
            height={asteroidSizes[tech] || 0}
            scrollProgress={scrollProgress}
            isScrollingActive={isScrollingActive}
            isScrollingBackward={isScrollingBackward}
          />
        </div>
      )),
    [
      asteroidEntries,
      asteroidSizes,
      scrollProgress,
      isScrollingActive,
      isScrollingBackward,
    ]
  );

  return (
    <div ref={containerRef} className="relative w-screen h-[2000vh]">
      {/* Message section positioned in top-left corner */}
      <div className="fixed top-[5vh] left-[5vw] text-left w-[90vw] max-w-[800px] z-10 p-4 sm:p-8 [perspective:1000px]">
        <div className="relative my-2 sm:my-4 min-h-[1.5em] overflow-visible [transform-style:preserve-3d] flex flex-wrap gap-2">
          <span
            ref={(el) => (textElements.current[0] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            A
          </span>
          <span
            ref={(el) => (textElements.current[1] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            <span
              ref={(el) => (highlightedText.current[1] = el)}
              className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
            >
              Decade
            </span>
          </span>
          <span
            ref={(el) => (textElements.current[2] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            of
          </span>
          <span
            ref={(el) => (textElements.current[3] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            shaping
          </span>
          <span
            ref={(el) => (textElements.current[4] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            the
          </span>
          <span
            ref={(el) => (textElements.current[5] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            <span
              ref={(el) => (highlightedText.current[5] = el)}
              className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
            >
              Web
            </span>
          </span>
          <span
            ref={(el) => (textElements.current[6] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            spectrum.
          </span>
        </div>
      </div>

      <div className="fixed inset-0 flex items-center justify-center">
        {asteroidComponents}
      </div>
    </div>
  );
};

export default StellarSkills;
