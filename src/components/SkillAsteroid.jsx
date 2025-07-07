import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { ASTEROID_CONFIGS } from "./asteroidConfigs.jsx";

// Random HSL color generator - regular function since it's outside component
const getRandomHSL = () => {
  const hue = Math.random() * 360;
  const saturation = Math.random() * 20 + 80; // 80-100%
  const lightness = Math.random() * 30 + 55; // 55-85%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const SkillAsteroid = ({
  technology = "react",
  width = 300,
  height = 300,
  className = "",
  style = {},
  scrollProgress = 0,
  isScrollingActive = false,
  scrollSpeed = 0,
  isScrollingBackward = false,
}) => {
  const config = ASTEROID_CONFIGS[technology];
  const dotRefs = useRef([]);
  const rayRefs = useRef([]);
  const lastScrollProgress = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const gradientCache = useRef(new Map());
  const animationFrameRef = useRef(null);

  if (!config) {
    console.warn(`Unknown technology: ${technology}`);
    return null;
  }

  // Memoize the transform style to avoid unnecessary re-renders
  const transformStyle = useMemo(
    () => ({
      ...style,
      transform: isScrollingBackward ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease-out",
    }),
    [style, isScrollingBackward]
  );

  // Optimized gradient creation with caching
  const createGradient = useCallback((ray, index, color, flowPosition) => {
    const gradientId = `rayGradient${index}`;

    // Check cache first
    if (gradientCache.current.has(gradientId)) {
      const cached = gradientCache.current.get(gradientId);
      if (cached.color === color && cached.flowPosition === flowPosition) {
        return cached.gradient;
      }
    }

    const gradient = `url(#${gradientId})`;
    const svg = ray.closest("svg");

    if (!svg) return gradient;

    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.insertBefore(defs, svg.firstChild);
    }

    // Remove existing gradient
    const existingGradient = defs.querySelector(`#${gradientId}`);
    if (existingGradient) {
      existingGradient.remove();
    }

    // Create new gradient
    const linearGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    linearGradient.setAttribute("id", gradientId);
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("x2", "100%");
    linearGradient.setAttribute("y2", "0%");

    const stops = [
      { offset: "0%", color },
      { offset: `${flowPosition}%`, color },
      { offset: `${flowPosition}%`, color: "transparent" },
      { offset: "100%", color: "transparent" },
    ];

    stops.forEach(({ offset, color }) => {
      const stop = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop.setAttribute("offset", offset);
      stop.setAttribute("stop-color", color);
      linearGradient.appendChild(stop);
    });

    defs.appendChild(linearGradient);

    // Cache the result
    gradientCache.current.set(gradientId, { color, flowPosition, gradient });

    return gradient;
  }, []);

  // Optimized fade-out gradient creation
  const createFadeOutGradient = useCallback((ray, index) => {
    const gradientId = `rayGradient${index}`;
    const gradient = `url(#${gradientId})`;
    const svg = ray.closest("svg");

    if (!svg) return gradient;

    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.insertBefore(defs, svg.firstChild);
    }

    const existingGradient = defs.querySelector(`#${gradientId}`);
    if (existingGradient) {
      existingGradient.remove();
    }

    const linearGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    linearGradient.setAttribute("id", gradientId);
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("x2", "100%");
    linearGradient.setAttribute("y2", "0%");

    // All stops transparent for fade out
    for (let i = 0; i < 4; i++) {
      const stop = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop.setAttribute("offset", `${i * 33.33}%`);
      stop.setAttribute("stop-color", "transparent");
      linearGradient.appendChild(stop);
    }

    defs.appendChild(linearGradient);
    return gradient;
  }, []);

  // Optimized dot animation
  const animateDot = useCallback(
    (dot, index) => {
      if (!dot) return;

      const dotProgress = Math.max(
        0,
        Math.min(1, (scrollProgress - index * 0.1) * 1.5)
      );

      if (isScrollingActive && dotProgress > 0) {
        const color = getRandomHSL();
        dot.style.fill = color;
        dot.style.opacity = "1";
        dot.style.transition = "opacity 0.3s ease-out";
      } else {
        dot.style.opacity = "0";
        dot.style.transition = "opacity 0.5s ease-out";

        setTimeout(() => {
          if (dot.style.opacity === "0") {
            dot.style.fill = "transparent";
          }
        }, 500);
      }
    },
    [scrollProgress, isScrollingActive]
  );

  // Optimized ray animation
  const animateRay = useCallback(
    (ray, index) => {
      if (!ray) return;

      const rayProgress = Math.max(0, Math.min(1, scrollProgress * 1.2));

      if (isScrollingActive && rayProgress > 0) {
        const color = getRandomHSL();
        const scrollSpeedMultiplier = Math.max(0.001, scrollProgress * 0.1);
        const time = Date.now() * scrollSpeedMultiplier;
        const randomOffset = index * 123.456;
        const cycleProgress = (Math.sin((time + randomOffset) * 1.5) + 1) / 2;
        const flowPosition = cycleProgress * 100;

        const gradient = createGradient(ray, index, color, flowPosition);
        ray.style.fill = gradient;
        ray.style.stroke = "none";
        ray.style.opacity = "1";
        ray.style.transition = "opacity 0.3s ease-out";
      } else {
        const gradient = createFadeOutGradient(ray, index);
        ray.style.fill = gradient;
        ray.style.stroke = "none";
        ray.style.transition = "all 0.5s ease-out";
      }
    },
    [scrollProgress, isScrollingActive, createGradient, createFadeOutGradient]
  );

  // Initialize dots and rays as transparent when component mounts
  useEffect(() => {
    if (dotRefs.current.length === 0) return;

    dotRefs.current.forEach((dot) => {
      if (dot) {
        dot.style.fill = "transparent";
      }
    });

    rayRefs.current.forEach((ray) => {
      if (ray) {
        ray.style.fill = "transparent";
      }
    });
  }, []);

  // Optimized animation effect using requestAnimationFrame
  useEffect(() => {
    if (dotRefs.current.length === 0) return;

    const animate = () => {
      // Animate dots
      dotRefs.current.forEach((dot, index) => {
        animateDot(dot, index);
      });

      // Animate rays
      rayRefs.current.forEach((ray, index) => {
        animateRay(ray, index);
      });
    };

    // Use requestAnimationFrame for smooth animations
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    scrollProgress,
    isScrollingActive,
    isScrollingBackward,
    animateDot,
    animateRay,
  ]);

  // Cleanup gradient cache on unmount
  useEffect(() => {
    return () => {
      gradientCache.current.clear();
    };
  }, []);

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={width}
        height={height}
        viewBox="0 0 480.055 480.055"
        className={className}
        style={transformStyle}
      >
        <g transform="translate(0 -540.36)">
          <g>
            <g>
              {/* Astro Circle */}
              <path
                d="M135.503,770.815c-69.2,0-125.5,55.8-125.5,124.4c0,69,56.3,125.2,125.5,125.2s125.5-56.2,125.5-125.2 C261.003,826.615,204.703,770.815,135.503,770.815z M135.503,1000.415c-58.2,0-105.5-47.2-105.5-105.2 c0-57.6,47.3-104.4,105.5-104.4c58.2,0,105.5,46.8,105.5,104.4C241.003,953.215,193.703,1000.415,135.503,1000.415z"
                fill={config.color}
              />

              {/* Technology Logo - switch based on scroll direction */}
              {isScrollingBackward ? config.logoBackward : config.logoForward}

              {/* Astro Rays */}
              <path
                ref={(el) => (rayRefs.current[0] = el)}
                d="M233.603,736.015c1.9,1.5,4.2,2.3,6.4,2.3c2.9,0,5.7-1.3,7.7-3.6l146.9-177.9c3.6-4.3,3-10.6-1.3-14.1 c-4.3-3.6-10.6-3-14.1,1.3l-146.9,177.9C228.703,726.215,229.303,732.515,233.603,736.015z"
              />
              <path
                ref={(el) => (rayRefs.current[1] = el)}
                d="M393.203,616.315c-4.3-3.5-10.6-2.8-14.1,1.5l-125.7,156.7c-3.5,4.3-2.8,10.6,1.5,14.1c1.9,1.5,4.1,2.2,6.3,2.2l0,0 c2.9,0,5.8-1.3,7.8-3.8l125.7-156.6C398.203,626.115,397.503,619.815,393.203,616.315z"
              />
              <path
                ref={(el) => (rayRefs.current[2] = el)}
                d="M213.103,663.015c1.9,1.6,4.2,2.4,6.5,2.4c2.8,0,5.6-1.2,7.6-3.5l62.9-73.7c3.6-4.2,3.1-10.5-1.1-14.1 c-4.2-3.6-10.5-3.1-14.1,1.1l-62.9,73.7C208.403,653.115,208.903,659.415,213.103,663.015z"
              />
              <path
                ref={(el) => (rayRefs.current[3] = el)}
                d="M331.803,787.115l136-167.7c3.4-4.3,2.8-10.6-1.5-14.1c-4.3-3.4-10.6-2.8-14.1,1.5l-135.9,167.7 c-3.4,4.3-2.8,10.6,1.5,14.1c1.9,1.5,4.1,2.2,6.3,2.2C327.003,790.815,329.903,789.515,331.803,787.115z"
              />
              <path
                ref={(el) => (rayRefs.current[4] = el)}
                d="M466.603,710.615c-4.2-3.6-10.5-3.2-14.1,1l-62.9,72.9c-3.6,4.2-3.2,10.5,1,14.1c1.9,1.6,4.2,2.4,6.5,2.4 c2.8,0,5.6-1.2,7.6-3.4l62.9-72.9C471.203,720.515,470.803,714.215,466.603,710.615z"
              />

              {/* Astro Dots with animation refs */}
              <path
                ref={(el) => (dotRefs.current[0] = el)}
                d="M172.403,728.115c14.2,0,25.7-11.5,25.7-25.7s-11.5-25.7-25.7-25.7s-25.7,11.5-25.7,25.7 S158.203,728.115,172.403,728.115z M172.403,696.815c3.1,0,5.7,2.6,5.7,5.7c0,3.1-2.6,5.7-5.7,5.7c-3.1,0-5.7-2.6-5.7-5.7 C166.703,699.415,169.303,696.815,172.403,696.815z"
              />
              <path
                ref={(el) => (dotRefs.current[1] = el)}
                d="M350.003,812.315c-14.2,0-25.7,11.5-25.7,25.7s11.5,25.7,25.7,25.7s25.7-11.5,25.7-25.7S364.203,812.315,350.003,812.315 z M350.003,843.715c-3.1,0-5.7-2.6-5.7-5.7c0-3.1,2.6-5.7,5.7-5.7c3.1,0,5.7,2.6,5.7,5.7 C355.703,841.115,353.103,843.715,350.003,843.715z"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* Technology Label - only visible when not scrolling */}
      <div
        className={`absolute transform -translate-x-1/2 text-center w-1/2 rounded-full border-2 px-2 py-1 w-[75%] ${
          isScrollingBackward ? "-top-9 right-[-47%]" : "-bottom-10 left-[27%]"
        }`}
        style={{
          color: config.color,
          fontSize: `${Math.max(10, width / 30)}px`,
          fontWeight: "600",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
          whiteSpace: "nowrap",
          opacity: !isScrollingActive && width > 70 ? 1 : 0, // Only show when not scrolling and asteroid is large enough
          transition: "opacity 0.3s ease-out",
          borderColor: config.color,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        {config.label}
      </div>
    </div>
  );
};

export default SkillAsteroid;
