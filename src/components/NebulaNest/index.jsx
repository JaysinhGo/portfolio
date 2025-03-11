import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TEXT_ANIMATION_CONFIG = {
  lines: [
    { start: 0.2, peak: 0.35, end: 0.7 },
    { start: 0.3, peak: 0.45, end: 0.8 },
    { start: 0.4, peak: 0.55, end: 0.9 },
  ],
};

const createGradientStyle = (progress) => {
  const hue = (progress * 720) % 360;
  return `linear-gradient(${progress * 720}deg, 
    hsl(${hue}, 100%, 50%) 0%, 
    hsl(${(hue + 120) % 360}, 100%, 50%) 50%, 
    hsl(${(hue + 240) % 360}, 100%, 50%) 100%)`;
};

const NebulaNest = () => {
  const containerRef = useRef(null);
  const statueofunityRef = useRef(null);
  const mainStatueGroupRef = useRef(null);
  const energyFieldRef = useRef(null);
  const innerRuneRef = useRef(null);
  const outerRuneRef = useRef(null);
  const glowingRimRef = useRef(null);
  const cosmicVortexRef = useRef(null);
  const textElements = useRef([]);
  const highlightedText = useRef([]);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      toggleActions: "play reverse play reverse",
      onToggle: ({ isActive }) => {
        gsap.set(containerRef.current, {
          opacity: isActive ? 1 : 0,
        });
      },
    });

    if (!mainStatueGroupRef.current) return;

    // Cache DOM elements
    const paths = Array.from(
      mainStatueGroupRef.current.querySelectorAll("path")
    );
    const statue = statueofunityRef.current;

    // Initial state configuration
    const initialState = {
      opacity: 0,
      scale: 0,
      transformOrigin: "center center",
    };

    // Set initial states
    gsap.set([statue, paths], initialState);
    gsap.set(paths, {
      y: 100,
      filter: "blur(20px) brightness(0)",
    });

    // Main animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.5,
        onLeave: () => {
          gsap.to(statue, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        },
        onEnterBack: () => {
          gsap.to(statue, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        },
      },
    });

    // Animation sequence
    tl.to(statue, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    })
      .fromTo(
        paths,
        {
          opacity: 0,
          scale: 0,
          y: 50,
          filter: "blur(20px) brightness(0)",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px) brightness(1.2)",
          duration: 1,
          stagger: {
            amount: 0.8,
            from: "center",
            ease: "power2.out",
          },
        },
        "-=0.3"
      )
      // Power surge effect
      .to(paths, {
        scale: 1.05,
        filter: "blur(0px) brightness(1.5)",
        duration: 0.3,
        stagger: {
          amount: 0.4,
          from: "center",
        },
      })
      .to(paths, {
        scale: 1,
        filter: "blur(0px) brightness(1.2)",
        duration: 0.3,
        stagger: {
          amount: 0.2,
          from: "center",
        },
      });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useGSAP(() => {
    // Energy field animation
    if (energyFieldRef.current) {
      gsap.set(energyFieldRef.current, {
        transformOrigin: "center center",
        opacity: 0,
        rotation: 0,
      });

      gsap.to(energyFieldRef.current, {
        rotation: -360,
        opacity: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
          onLeave: () => {
            gsap.to(energyFieldRef.current, {
              opacity: 0,
              duration: 0.5,
            });
          },
          onEnterBack: () => {
            gsap.to(energyFieldRef.current, {
              opacity: 0.1,
              duration: 0.5,
            });
          },
        },
      });
    }

    // Rune circles animation
    if (innerRuneRef.current && outerRuneRef.current) {
      gsap.set([innerRuneRef.current, outerRuneRef.current], {
        transformOrigin: "center center",
        opacity: 0,
        transformPerspective: 1000,
      });

      const runesTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      runesTl.to([innerRuneRef.current, outerRuneRef.current], {
        opacity: 0.3,
        rotateX: 45,
        duration: 1,
        stagger: 0.2,
      });

      // Continuous rotations
      gsap.to(innerRuneRef.current, {
        rotation: 360,
        rotateY: -360,
        duration: 50,
        repeat: -1,
        ease: "none",
      });

      gsap.to(outerRuneRef.current, {
        rotation: -360,
        rotateY: 360,
        duration: 70,
        repeat: -1,
        ease: "none",
      });
    }
  }, []);

  useGSAP(() => {
    if (glowingRimRef.current) {
      // Initial state
      gsap.set(glowingRimRef.current, {
        transformOrigin: "center center",
        opacity: 0,
        scale: 0.95,
        filter: "blur(5px)",
      });

      // Scroll-based reveal with 3D effect
      const glowTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      glowTl.to(glowingRimRef.current, {
        opacity: 0.4,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power2.inOut",
      });

      // Enhanced glow effect
      gsap.to(glowingRimRef.current, {
        keyframes: [
          {
            strokeWidth: 3,
            opacity: 0.4,
            scale: 1,
            duration: 2,
          },
          {
            strokeWidth: 4,
            opacity: 0.6,
            scale: 1.02,
            duration: 1.5,
          },
          {
            strokeWidth: 3,
            opacity: 0.4,
            scale: 1,
            duration: 1.5,
          },
        ],
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }, []);

  useGSAP(() => {
    const words = textElements.current;
    const highlighted = highlightedText.current;

    gsap.set(words, {
      opacity: 0,
      y: 100,
      rotationX: -90,
      scale: 0.8,
      transformOrigin: "center center",
    });

    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "90% bottom",
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
            const lineIndex = Math.floor(i / 5);
            const wordInLineIndex = i % 5;
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

    return () => textTl.kill();
  }, []);

  useGSAP(() => {
    if (!cosmicVortexRef.current) return;

    // Get all circles
    const circles = cosmicVortexRef.current.querySelectorAll("circle");

    // Set initial state
    gsap.set(circles, {
      opacity: 0,
      scale: 0,
      transformOrigin: "center center",
    });

    // Create timeline for the vortex animation
    const vortexTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onEnter: () => {
          gsap.to(cosmicVortexRef.current, {
            opacity: 1,
            duration: 0.5,
          });
        },
        onLeave: () => {
          gsap.to(cosmicVortexRef.current, {
            opacity: 0,
            duration: 0.5,
          });
        },
        onEnterBack: () => {
          gsap.to(cosmicVortexRef.current, {
            opacity: 1,
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          gsap.to(cosmicVortexRef.current, {
            opacity: 0,
            duration: 0.5,
          });
        },
      },
    });

    // Animate circles
    circles.forEach((circle, i) => {
      const delay = i * 0.02;
      vortexTl.to(
        circle,
        {
          opacity: circle.getAttribute("opacity"),
          scale: 1,
          duration: 1,
          delay: delay,
          ease: "power2.out",
        },
        0
      );
    });

    // Add continuous rotation
    circles.forEach((circle) => {
      gsap.to(circle, {
        rotate: "+=360",
        duration: gsap.utils.random(20, 40),
        repeat: -1,
        ease: "none",
      });
    });

    // Update gradient colors on scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const gradient = document.querySelector("#vvvortex-grad");
        if (gradient) {
          // Enhanced golden gradient colors
          const color1 = `hsl(${36 + progress * 8}, 100%, ${
            65 + progress * 15
          }%)`; // Bright golden
          const color2 = `hsl(${43 + progress * 8}, 90%, ${
            45 + progress * 10
          }%)`; // Deep golden

          gradient.children[0].setAttribute("stop-color", color1);
          gradient.children[1].setAttribute("stop-color", color2);
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-screen h-[1200vh] opacity-0">
      {/* Add cosmic vortex SVG first */}
      <svg
        ref={cosmicVortexRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        className="fixed top-0 left-0 w-full h-full z-[1] opacity-0"
      >
        <defs>
          <linearGradient
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            id="vvvortex-grad"
          >
            <stop stopColor="hsl(36, 100%, 65%)" stopOpacity={1} offset="0%" />
            <stop stopColor="hsl(43, 90%, 45%)" stopOpacity={1} offset="100%" />
          </linearGradient>
        </defs>
        <g stroke="url(#vvvortex-grad)" fill="none" strokeLinecap="round">
          {Array.from({ length: 40 }).map((_, index) => {
            // Adjusted radius spacing for 40 circles
            const radius = 1925 - index * 45;

            // Calculate opacity - reduced overall opacity
            const normalizedIndex = (40 - index) / 40; // 1 to 0
            const opacity = 0.6 * normalizedIndex; // Reduced from 0.95 to 0.6

            // Adjust stroke width ranges for 40 circles
            const strokeWidth =
              index < 13 ? 5 : index < 26 ? 4 : index < 33 ? 3 : 2;

            // Pure dot pattern (equal dot size and space)
            const dotSize = strokeWidth;
            const spaceSize = dotSize * 6; // Increased spacing for more distinct dots

            return (
              <circle
                key={index}
                r={radius}
                cx={400}
                cy={400}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dotSize} ${spaceSize}`}
                transform={`rotate(${index * 3}, 400, 400)`}
                opacity={opacity}
              />
            );
          })}
        </g>
      </svg>

      {/* Statue container with higher z-index */}
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[2]">
        <svg
          ref={statueofunityRef}
          className="w-screen h-screen sm:h-[90vh] md:w-[70vw] lg:h-[60vh] object-contain opacity-0 scale-0"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 980 980"
          width="980"
          height="980"
        >
          <defs>
            {/* Base sphere gradient with mystical gold */}
            <radialGradient id="sphereGradient" cx="25%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#FFE5A9" />
              <stop offset="20%" stopColor="#E4B78D" />
              <stop offset="40%" stopColor="#D4A77D" />
              <stop offset="70%" stopColor="#B8794C" />
              <stop offset="85%" stopColor="#8B5E34" />
              <stop offset="100%" stopColor="#6B4423" />
            </radialGradient>

            {/* Rune glow effect */}
            <filter id="runeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 1 0 1 0 0 0.8 0 0 1 0 0.3 0 0 0 3 0"
              />
            </filter>

            {/* Ancient energy field */}
            <filter id="ancientField">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012"
                numOctaves="5"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.3 0 0 0 1 0"
              />
              <feGaussianBlur stdDeviation="3" />
              <feComposite operator="in" in2="SourceGraphic" />
            </filter>

            {/* Rune circle animation */}
            <filter id="runeCircle">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.05"
                numOctaves="2"
                seed="5"
              >
                <animate
                  attributeName="seed"
                  from="0"
                  to="100"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="5" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 1 0 1 0 0 0.8 0 0 1 0 0.3 0 0 0 1 0"
              />
            </filter>

            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="vvvortex-grad"
            >
              <stop
                stopColor="hsl(36, 100%, 65%)"
                stopOpacity={1}
                offset="0%"
              />
              <stop
                stopColor="hsl(43, 90%, 45%)"
                stopOpacity={1}
                offset="100%"
              />
            </linearGradient>
          </defs>

          {/* Background energy field */}
          <circle
            ref={energyFieldRef}
            cx="490"
            cy="490"
            r="445"
            fill="#FFD700"
            opacity="0"
            filter="url(#ancientField)"
          />

          {/* Rotating rune circles */}
          {/* <g transform="translate(490, 490)">
            <circle
              ref={innerRuneRef}
              r="460"
              fill="none"
              stroke="#FFD700"
              strokeWidth="2"
              opacity="0"
              filter="url(#runeCircle)"
            />
            <circle
              ref={outerRuneRef}
              r="470"
              fill="none"
              stroke="#FFD700"
              strokeWidth="2"
              opacity="0"
              filter="url(#runeCircle)"
            />
          </g> */}

          {/* Main statue group */}
          <g
            ref={mainStatueGroupRef}
            transform="translate(100, 100) scale(0.85)"
          >
            <path
              d="m482 164h10l16 5 4 3v2h2l5 11 1 5v20l-2 9-1 2v7l1 6 11 1 11 4 11 7 9 10 8 16 5 15 4 22 5 29 6 26 7 25 14 43-1 3-16-5 7 35v7l-4 5-3 14-5 9-9 8-8 3h-2l6 41 4 18 2 4v7l-5 5-12 5-7 2-1 7 5 10 1 4v13l-5 10-3 4 2 4v9l-4 8 2 10v12l-5 14-3 6 2 10 1 6v10l-4 13-3 5 1 4v13l-2 5h-4v19l-3 5-1 1 46 1v19l-1 1h-206l-1-1v-19h37l1-4 16-4 12-5 9-6 3-1 2-4 7-10 1-2-6-1-3-9v-19l-5-19-3-17-2-11 1-18 1-6v-28l-4-26-1-14-8-1-15-5-8-5-3-6 6-5 5-10 4-16 2-12 1-11-5-2-6-5-6-10-1-4v-13l3-10-2-2v-9l6-23 8-18 2-8-4-1-9-7-7-7-2-3 1-10 8-17 7-14 10-28 7-20 8-15 8-11 10-10 10-7 4-3-1-9-3-12-8-1-5-5-2-14v-4l-4-1 1-28 3-9 8-9 10-5z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m536 563h21l11 3 10 10 1 7-10 6-13 4-1 7 5 10 1 4v13l-5 10-3 4 2 4v9l-4 8 2 10v12l-5 14-3 6 2 10 1 6v10l-4 13-3 5 1 4v13l-2 5h-4v19l-3 5-1 1 46 1v19l-1 1h-206l-1-1v-19h37l1-4 16-4 12-5 9-6 3-1 2-4 7-10 1-2-6-1-3-9v-19l-5-19-3-17-2-11 1-18 1-6v-28l-4-26-1-14-8-1-15-5-8-5-3-6 6-5 5-10 4-16 2-12 1-11-5-2-6-5-6-10-1-4v-13l3-10-2-2v-9l6-23 8-18 2-8-4-1-9-7-7-7-2-3 1-10 8-17 7-14 10-28 7-20 8-15 8-11 10-10 10-7 4-3-1-9-3-12-8-1-5-5-2-14v-4l-4-1 1-28 3-9 8-9 10-5z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m465 439h23l40 3 23 2v16l3 3 15 7 11 5 4 1h9 3l-2 7-3 10-5 8-8 7-8 3h-2l6 41 4 18 2 4v7l-2-3-2-5-4-2-4-3v-2l-7-1-4-1h-21l-34 6-11 2-24 3-14 1-48 1-2 1-1-3 6-5 5-10 4-16 2-12 1-11-5-2 2-1h3l1-10 2-33 1-25 15-6 9-3z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m518 234 11 1 11 4 11 7 9 10 8 16 5 15 4 22 5 29 6 26 7 25 14 43-1 3-16-5-1 3v-3l-23-3h-52l-28 1h-17v-92l2-15 3-12 6-15 6-12 10-14 11-16 2-2 4-10 3-1z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m482 164h10l16 5 4 3v2h2l5 11 1 5v20l-2 9-1 2v7l1 4v7l-2 1-4 8h-2l-2 4-9 8-18 12-4 3-5-2-2-2v-4l-1 3-2 1-7 16-8 16-4 9-11 21-5 14-4 10-3 11-3 24-1 16-1 7v8h-1v-6l-4-1-9-7-7-7-2-3 1-10 8-17 7-14 10-28 7-20 8-15 8-11 10-10 10-7 4-3-1-9-3-12-8-1-5-5-2-14v-4l-4-1 1-28 3-9 8-9 10-5z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m370 796h208v19l-1 1h-206l-1-1z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m480 743 4 2 4 5 7 5 13 6 23 7 8-1 1-17 2 2v13l-2 5h-4v19l-3 5-3 2h-123l1-4 16-4 12-5 9-6 3-1 2-4 7-10 1-2-6-1 1-3 1 2 9-1 14-10z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m470 264v3l-1 3-2 1-7 16-8 16-4 9-11 21-5 14-4 10-3 11-3 24-1 16-1 7v8h-1v-6l-4-1-9-7-7-7-2-3 1-10 8-17 7-14 10-28 7-20 8-15 8-11 10-10 10-7z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m555 427h19l14 2 3 1 2 4 6 31v7l-2 3-4 2h-9l-11-4-22-11-1-2v-8l3-20z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m483 577h1l2 18v34l-1 14v12l10 15 9 10v2h3l3 3v2l-4-1-9-6-9-11-3-5v-3h-2l-1 21-2 36v11l-2-1-1-15-3 7h-2l-2 5-6 6-9 3 1-4 6-4 7-8 7-10 1-28-7 9-9 6-9 1 4-3 3-2h3v-2l7-6 8-13 1-2 2-28v-10l-4 8-2 3h-2l-2 4-3 3-10 5-4 1-5 26-3 11h-1v-8l5-43 4-51 2-1v44l-2 18 5-1 4-3h2l2-4 6-7 1-3h2l1-4 5-9 1-7z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m554 464 9 3 17 8 4 1h9 3l-2 7-3 10-5 8-8 7-9 2-7 1-4-4v-6l2-4-4 1-2-2v-24l1-6z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m420 475h3v21l-1 17-2 6-7-1-7-8-4-10v-13l3-8 2-2h7z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m416 427h5v24h2v24l-9 3h-7l-4-3v-9l6-23z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m538 271h2l-1 5-7 15-5 13-4 9-8 20-7 22-5 14-4 16h-2l1-15 4-20 5-18 6-16 9-19 8-14z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m527 477 1 4-8 15h-2l-2 5-2 3h-2l-1 4-7 8h-2l-2 4h-2v2h-2v2l-5 4h-3v2l-6 4h-2v2l-16 8-13 4-8 1h-11l4-2 20-7 10-5 10-6 4-3h2v-2l6-4 12-11 10-10 2-3h2l2-5 2-3h2l2-4z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m522 456 1 2-6 11-8 10-3 4h-2l-2 4-3 1-1 3h-2v2l-15 11-14 8-10 4-7 3-19 4v-2l13-5 19-10 11-7 10-7h2v-2l10-8 10-9 3-1 1-3h2l2-4z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m499 169 6 1 7 2v2h2l5 11 1 5v20l-2 5h-2l-1 2-1-4v-11l-3-6-7-2-6-10-1-2v-10z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m473 284 1 4-5 40-4 46-2 58h-1l-2-24v-35l2-28 4-29 6-29z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m516 237v3l-4 8h-2l-2 4-9 8-18 12-4 3-5-2-2-2 1-6 9-2 16-11 10-8z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m405 576h30l1 1v14h-8l-15-5-8-5-1-4z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m565 567 6 2 5 4 3 5v3h-2l-2 3-5 1v2l-6 2-6-1 3-12z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m528 641h21l-2 2-16 3h-19l-12-2v-1z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m548 601h2l-2 4-14 9-14 4h-8l1-2 7-3 7-2 12-5z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m502 730 4 2 10 8 4 2v2l5 1 12 3v2h-12l-13-6-7-8-3-4z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m540 706 2 1-2 2-15 4h-17l-8-2v-1z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m536 664h9v2l-9 3-14 1-12-3v-2z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m495 224 1 2-6 8-8 5-8 3h-8l4-3 16-8z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m487 755h1v14l-4 6-4 1v2h-2v2l-6 2v2l-7 4-1 5h-1v-6l5-5 8-6 5-2v-2h2l2-4z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m518 212 1 4-2 5v7l1 6h-2l-2-4v-14l4-1z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m576 580 3 1v2l-10 6-9 2v-2l10-2v-2l5-2z"
              fill="url(#sphereGradient)"
            />
            <path
              d="m516 180 2 2 2 8v20h-1l-1-18-3-10z"
              fill="url(#sphereGradient)"
            />
            <path d="m409 443h1l-1 11-3 6-1-3z" fill="url(#sphereGradient)" />
            <path d="m513 216 2 2v6h-6z" fill="url(#sphereGradient)" />
            <path d="m404 461h1l1 14h-3v-9z" fill="url(#sphereGradient)" />
          </g>

          {/* Glowing rim */}
          {/* <circle
            ref={glowingRimRef}
            cx="490"
            cy="490"
            r="440"
            fill="none"
            stroke="#FFD700"
            strokeWidth="3"
            opacity="0"
          /> */}
        </svg>
      </div>

      {/* Message section with dynamic height */}
      <div className="fixed bottom-[5vh] left-1/2 -translate-x-1/2 text-center w-[95vw] max-w-[1000px] z-10 p-4 sm:p-8 [perspective:1000px]">
        {/* First line */}
        <div className="relative my-2 sm:my-4 min-h-[1.5em] overflow-visible [transform-style:preserve-3d] flex justify-center">
          <span
            ref={(el) => (textElements.current[0] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            The
          </span>
          <span className="mx-1 sm:mx-2"></span>
          <span
            ref={(el) => (textElements.current[1] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            <span
              ref={(el) => (highlightedText.current[1] = el)}
              className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
            >
              Statue
            </span>
          </span>
          <span className="mx-1 sm:mx-2"></span>
          <span
            ref={(el) => (textElements.current[2] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            <span
              ref={(el) => (highlightedText.current[2] = el)}
              className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
            >
              of
            </span>
          </span>
          <span className="mx-1 sm:mx-2"></span>
          <span
            ref={(el) => (textElements.current[3] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            <span
              ref={(el) => (highlightedText.current[3] = el)}
              className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
            >
              Unity
            </span>
          </span>
          <span
            ref={(el) => (textElements.current[4] = el)}
            className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
          >
            ,
          </span>
        </div>

        {/* Second and third lines */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4">
          {/* "a remarkable landmark" */}
          <div className="relative min-h-[1.5em] overflow-visible [transform-style:preserve-3d] flex justify-center">
            <span
              ref={(el) => (textElements.current[5] = el)}
              className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              a
            </span>
            <span className="mx-1 sm:mx-2"></span>
            <span
              ref={(el) => (textElements.current[6] = el)}
              className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              remarkable
            </span>
            <span className="mx-1 sm:mx-2"></span>
            <span
              ref={(el) => (textElements.current[7] = el)}
              className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              landmark
            </span>
            <span
              ref={(el) => (textElements.current[8] = el)}
              className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              ,
            </span>
          </div>

          {/* "represents my Hometown" */}
          <div className="relative min-h-[1.5em] overflow-visible [transform-style:preserve-3d] flex justify-center">
            <span
              ref={(el) => (textElements.current[9] = el)}
              className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              represents
            </span>
            <span className="mx-1 sm:mx-2"></span>
            <span
              ref={(el) => (textElements.current[10] = el)}
              className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              my
            </span>
            <span className="mx-1 sm:mx-2"></span>
            <span
              ref={(el) => (textElements.current[11] = el)}
              className="inline-block text-[clamp(1rem,3vw,1.75rem)] font-medium text-white [transform-origin:center] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
            >
              <span
                ref={(el) => (highlightedText.current[11] = el)}
                className="inline-block bg-clip-text [-webkit-background-clip:text] text-transparent [will-change:background]"
              >
                Hometown
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NebulaNest;
