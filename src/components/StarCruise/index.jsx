import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GalacticRide from "../GalacticRide";

gsap.registerPlugin(ScrollTrigger);

const StarCruise = () => {
  // Refs for DOM elements
  const scrollContainerRef = useRef(null);
  const spaceShipRef = useRef(null);
  const spaceShipFireRef = useRef(null);

  // Simpler random color generator
  const getRandomHSL = () => {
    const h = Math.random() * 360;
    return `hsl(${h}, 100%, 50%)`;
  };

  useGSAP(() => {
    // Visibility animation
    ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: "top top",
      end: "bottom bottom",
      toggleActions: "play reverse play reverse",
      onToggle: ({ isActive }) => {
        gsap.to(spaceShipRef.current, {
          opacity: isActive ? 1 : 0,
          duration: 0.3,
        });
      },
    });

    let frame;
    let lastDirection = 1;

    gsap.set(spaceShipRef.current, {
      rotation: 90,
      x: -window.innerWidth,
      scale: 0,
    });

    gsap.set(spaceShipFireRef.current, {
      fill: "hsl(45, 100%, 55%)",
      opacity: 0,
    });

    const handleScroll = (progress, direction) => {
      if (direction !== lastDirection) {
        gsap.to(spaceShipRef.current, {
          duration: 0.1,
          rotation: direction === -1 ? 270 : 90,
          ease: "power1.out",
          overwrite: "auto",
        });
        lastDirection = direction;
      }

      if (progress < 0.01) {
        gsap.to(spaceShipRef.current, {
          duration: 0.1,
          x: -window.innerWidth * (1 - progress / 0.01),
          scale: progress / 0.01,
          opacity: progress / 0.01,
          ease: "power1.out",
        });
      } else if (progress > 0.99) {
        const exitProgress = (progress - 0.99) / 0.01;
        gsap.to(spaceShipRef.current, {
          duration: 0.1,
          x: window.innerWidth * exitProgress,
          scale: 1 - exitProgress,
          opacity: 1 - exitProgress,
          ease: "power1.in",
        });
      } else {
        gsap.to(spaceShipRef.current, {
          duration: 0.1,
          x: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
        });
      }
    };

    gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.1,
        onUpdate: (self) => {
          if (frame) cancelAnimationFrame(frame);

          frame = requestAnimationFrame(() =>
            handleScroll(self.progress, self.direction)
          );
        },
        onLeave: () => {
          gsap.to([spaceShipRef.current], {
            duration: 0.2,
            opacity: 0,
            overwrite: true,
          });
          gsap.to(spaceShipRef.current, { scale: 0, x: window.innerWidth });
        },
        onEnterBack: () => {
          gsap.to(spaceShipRef.current, {
            duration: 0.2,
            x: 0,
            scale: 1,
            opacity: 1,
            ease: "power1.out",
          });
        },
      },
    });

    let colorChangeInterval;
    let lastScrollTime = Date.now();
    let checkScrollTimeout;

    // Function to check if scrolling has stopped
    const checkScrolling = () => {
      const currentTime = Date.now();
      if (currentTime - lastScrollTime > 50) {
        // No scroll for 50ms - hide fire
        gsap.to(spaceShipFireRef.current, {
          opacity: 0,
          duration: 0.1,
          overwrite: true,
        });
        clearInterval(colorChangeInterval);
      } else {
        // Keep checking
        checkScrollTimeout = requestAnimationFrame(checkScrolling);
      }
    };

    ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: () => {
        // Update last scroll time
        lastScrollTime = Date.now();

        // Clear existing checks
        cancelAnimationFrame(checkScrollTimeout);
        clearInterval(colorChangeInterval);

        // Show fire and start color changes
        gsap.to(spaceShipFireRef.current, {
          opacity: 1,
          duration: 0.05,
          overwrite: true,
        });

        // Super fast color changes
        const changeColor = () => {
          gsap.set(spaceShipFireRef.current, {
            fill: getRandomHSL(),
          });
        };

        // Change color every 16ms
        changeColor();
        colorChangeInterval = setInterval(changeColor, 16);

        // Start checking for scroll stop
        checkScrollTimeout = requestAnimationFrame(checkScrolling);
      },
    });

    // Cleanup
    return () => {
      clearInterval(colorChangeInterval);
      cancelAnimationFrame(checkScrollTimeout);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <div ref={scrollContainerRef} className="relative w-screen">
        <div className="relative w-screen h-[100vh]"></div>
        <GalacticRide />
        <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center">
          <svg
            ref={spaceShipRef}
            className="w-[30px] sm:w-[40px] md:w-[50px] scale-0 origin-center"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="200"
            viewBox="0 0 75 150"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            transform="rotate(90)"
          >
            <path
              d="M36.551 0.902C32.379 4.371 27.422 10.067 23.707 15.645c-3.153 4.734 -6.093 10.5 -8.063 15.761 -2.543 6.785 -4.101 13.699 -4.816 21.328 -0.246 2.695 -0.351 9.68 -0.176 12.597 0.773 13.231 4.195 26.848 10.207 40.605 0.457 1.066 0.867 2.027 0.902 2.145 0.059 0.187 0.738 0.199 11.765 0.223 6.445 0.023 13.465 0.035 15.597 0.035h3.903l0.844 -1.875c1.09 -2.414 3.457 -8.343 4.347 -10.899 5.907 -16.887 7.817 -32.883 5.707 -47.754 -2.145 -15 -8.355 -28.852 -18.035 -40.137C43.125 4.441 38.485 0 37.887 0c-0.153 0 -0.691 0.363 -1.336 0.902m3.469 3.34C47.883 12.211 53.847 20.895 56.273 27.926c0.281 0.809 0.469 1.5 0.445 1.535 -0.035 0.035 -6.023 0.012 -13.301 -0.047 -7.289 -0.059 -15.82 -0.117 -18.973 -0.117H18.727l0.082 -0.316c0.141 -0.586 1.934 -4.523 2.918 -6.422 2.485 -4.793 5.379 -9.176 8.637 -13.078 2.098 -2.507 7.007 -7.253 7.512 -7.253 0.082 0 1.043 0.914 2.145 2.015m0.258 36.832c5.355 1.031 9.996 5.332 11.566 10.735 1.148 3.996 0.328 8.355 -2.321 12.235a14.453 14.453 0 0 1 -9.153 6.047c-1.184 0.234 -3.867 0.211 -5.086 -0.047 -3.211 -0.691 -5.743 -2.063 -8.109 -4.418 -2.262 -2.25 -3.527 -4.571 -4.101 -7.5 -0.211 -1.113 -0.187 -3.609 0.047 -4.84 1.031 -5.215 5.027 -9.879 9.984 -11.672 1.91 -0.691 5.109 -0.938 7.172 -0.539M28.793 99.492h6.246v7.617H22.535l-1.465 -3.785c-0.809 -2.074 -1.441 -3.821 -1.407 -3.879s0.668 -0.07 1.465 -0.023c0.773 0.035 4.219 0.07 7.664 0.07m26.754 0.07c0 0.035 -0.691 1.757 -1.547 3.809l-1.547 3.738H39.961v-7.617h7.793c4.289 0 7.793 0.035 7.793 0.07"
              fill="#C0C0C0"
            />
            <path
              ref={spaceShipFireRef}
              className="fill-transparent"
              d="M39.961 6.937c2.871 6.059 4.137 10.395 4.137 14.215 0.012 2.531 -0.481 4.207 -1.559 5.367l-0.481 0.527 6.012 0.047c3.305 0.023 6.035 0.023 6.059 0.012 0.105 -0.07 -2.59 -5.309 -3.691 -7.183 -3.082 -5.273 -6.375 -9.703 -9.738 -13.125l-1.559 -1.582zm-3.762 42.797c-2.402 0.668 -4.359 3.035 -4.523 5.461 -0.129 1.735 0.433 3.199 1.711 4.453 3.059 3.012 7.664 2.321 9.563 -1.429 0.515 -1.043 0.691 -1.91 0.621 -3.164 -0.059 -0.879 -0.129 -1.137 -0.539 -1.993a6.353 6.353 0 0 0 -3.879 -3.305c-0.75 -0.223 -2.179 -0.234 -2.953 -0.023m-26.121 31.195c-1.289 0.27 -2.555 0.984 -3.727 2.098 -1.641 1.559 -2.777 3.469 -3.656 6.129 -2.321 7.078 -2.098 17.859 0.657 31.957 0.493 2.485 1.324 6.293 1.395 6.375 0.035 0.023 0.059 -0.657 0.059 -1.523 0 -4.922 0.575 -13.347 1.242 -18.093 1.207 -8.66 2.965 -13.347 5.496 -14.731 0.563 -0.305 1.77 -0.363 2.379 -0.105 0.211 0.082 0.399 0.141 0.422 0.117 0.059 -0.059 -3.328 -12.211 -3.422 -12.305 -0.047 -0.047 -0.422 0 -0.844 0.082m54.082 0.199c-0.07 0.211 -3.305 11.578 -3.399 11.941l-0.082 0.316 0.575 -0.176c4.383 -1.371 7.243 6.293 8.355 22.395 0.211 3.023 0.351 6.926 0.351 9.657 0 1.441 0.023 2.601 0.047 2.578 0.082 -0.082 1.043 -4.313 1.523 -6.668 3.164 -15.703 3.153 -27.223 -0.047 -34.066 -1.571 -3.351 -4.113 -5.59 -6.891 -6.059 -0.246 -0.047 -0.399 -0.012 -0.433 0.082m-41.191 29.309c0 1.172 1.09 7.488 1.757 10.219 0.914 3.727 1.863 5.907 3.633 8.367 3.925 5.473 5.461 8.367 7.031 13.207 0.586 1.793 1.664 5.965 1.828 7.007 0.035 0.305 0.117 0.504 0.164 0.445 0.047 -0.047 0.176 -0.563 0.281 -1.148 0.117 -0.586 0.433 -1.957 0.715 -3.047 1.547 -6.047 3.269 -9.738 6.832 -14.684 2.836 -3.925 3.539 -5.121 4.406 -7.453 1.172 -3.117 2.121 -7.863 2.367 -11.765l0.082 -1.313h-5.847c-3.211 0 -9.762 -0.035 -14.543 -0.082l-8.707 -0.07z"
            />
          </svg>
        </div>
      </div>
      <div className="relative w-screen h-[100vh]"></div>
    </>
  );
};

export default StarCruise;
