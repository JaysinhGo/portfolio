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
  const [asteroidSizes, setAsteroidSizes] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollingActive, setIsScrollingActive] = useState(false);
  const [isScrollingBackward, setIsScrollingBackward] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const lastScrollProgress = useRef(0);
  const animationFrameRef = useRef(null);

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

        asteroidEntries.forEach(([tech, config]) => {
          const asteroid = asteroidRefs.current[tech];
          if (!asteroid) return;

          // Calculate progress with delay
          const techProgress = Math.max(0, progress - config.delay);

          // Calculate position
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
    if (!container) return;

    // Set initial state - hidden
    gsap.set(container, { opacity: 0 });

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
    <div ref={containerRef} className="relative w-screen h-[1000vh]">
      <div className="fixed inset-0 flex items-center justify-center">
        {asteroidComponents}
      </div>
    </div>
  );
};

export default StellarSkills;
