import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import resumePDF from "../../assets/JaysinhGohil-LeadWebDeveloper.pdf";

gsap.registerPlugin(ScrollTrigger);

function ScrollIndicator() {
  const scrollContainerRef = useRef(null);
  const svgRef = useRef(null);
  const circleRef = useRef(null);
  const trackRectRef = useRef(null);
  const arrowRef = useRef(null);
  const downloadCv = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const playButtonRef = useRef(null);
  const playButtonContainerRef = useRef(null);

  const handleDownloadCV = () => window.open(resumePDF, "_blank");

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "6lDEyKA5I40", // Your YouTube video ID
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
          onError: (error) => {
            console.error("YouTube player error:", error);
            setIsPlaying(false);
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  useGSAP(() => {
    const svg = svgRef.current;
    const circle = circleRef.current;
    const track = trackRectRef.current;
    const container = scrollContainerRef.current;
    const playButton = playButtonRef.current;
    const playButtonContainer = playButtonContainerRef.current;
    if (!svg || !circle || !track || !container) return;

    gsap.set(svg, { transformOrigin: "center", scale: 1 });
    gsap.set(playButton, { transformOrigin: "center", scale: 0, opacity: 0 });

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

    // Initial states
    gsap.set(playButtonContainer, {
      top: -100, // Start from above viewport
      right: -100, // Start from outside right
    });
    gsap.set(playButton, {
      transformOrigin: "center",
      scale: 0,
      opacity: 0,
    });

    // Create a timeline for coordinated animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "10% top", // Shorter distance for quicker animation
        scrub: true,
        toggleActions: "play none none reverse",
      },
    });

    // Add animations to timeline
    tl.to(playButtonContainer, {
      top: 32,
      right: 32,
      duration: 1,
      ease: "power2.out",
    }).to(
      playButton,
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "<"
    ); // Start at same time as container animation

    gsap.from(arrowRef.current, {
      y: -6,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });

    // Fade out CV button on scroll
    gsap.to(downloadCv.current, {
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        toggleActions: "play reverse play reverse",
      },
      y: 100,
      opacity: 0,
    });
  });

  return (
    <div ref={scrollContainerRef} className="relative w-screen h-[500vh]">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
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
      <div
        ref={downloadCv}
        onClick={handleDownloadCV}
        className="fixed flex gap-2 bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center p-2 px-4 bg-[var(--scroll-indicator-fill-rgba)] border-[var(--scroll-indicator-fill)] border-[0.1px] cursor-pointer rounded-md z-11 scale-[0.8]"
      >
        <svg
          className="w-6 h-6 fill-[#fff]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            ref={arrowRef}
            d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
          />
          <path d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" />
        </svg>
        <p className="text-24 font-normal text-white origin-center whitespace-nowrap transition-[filter,text-shadow] duration-300">
          Resume
        </p>
      </div>

      <div ref={playButtonContainerRef} className="fixed top-0 right-0 z-11">
        <button
          ref={playButtonRef}
          onClick={togglePlay}
          className="transform transition-all duration-300
            hover:scale-105 opacity-0 z-11 cursor-pointer 
            hover:-translate-y-0.5 active:translate-y-0.5 
            shadow-[0_0_15px_rgba(var(--scroll-indicator-fill-rgb),0.3)] 
            hover:shadow-[0_0_20px_rgba(var(--scroll-indicator-fill-rgb),0.5)]
            active:shadow-[0_0_10px_rgba(var(--scroll-indicator-fill-rgb),0.2)]"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          <svg
            className="w-8 h-8 rounded-full 
              border-[var(--scroll-indicator-fill)] border-[1px]
              bg-[rgba(var(--scroll-indicator-fill-rgb),0.1)]
              backdrop-blur-sm
              transition-all duration-300
              hover:bg-[rgba(var(--scroll-indicator-fill-rgb),0.2)]
              [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.3))]
              hover:[filter:drop-shadow(0_4px_8px_rgba(0,0,0,0.4))]"
            viewBox="0 0 496.158 496.158"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isPlaying ? (
              <g transform="translate(0, 20)">
                <path
                  className="fill-[var(--scroll-indicator-fill-rgba)]"
                  d="M496.158 248.085c0-137.022-111.068-248.082-248.074-248.082C111.07.003 0 111.063 0 248.085c0 137.001 111.07 248.07 248.084 248.07 137.006 0 248.074-111.069 248.074-248.07z"
                />
                <g fill="#DFF2F4">
                  <rect x="175" y="175" width="50" height="150" rx="10" />
                  <rect x="275" y="175" width="50" height="150" rx="10" />
                </g>
              </g>
            ) : (
              <g transform="translate(0, -20)">
                <path
                  className="fill-[var(--scroll-indicator-fill-rgba)]"
                  d="M496.158 248.085c0-137.022-111.068-248.082-248.074-248.082C111.07.003 0 111.063 0 248.085c0 137.001 111.07 248.07 248.084 248.07 137.006 0 248.074-111.069 248.074-248.07z"
                />
                <path
                  fill="#DFF2F4"
                  d="M315.147 174.853c-4.6-1.8-9.8-1.3-14 1.4l-90 57.9c-2.8 1.8-4.5 4.9-4.5 8.2v96.4c-6.1-3.1-13.4-3.9-20.9-1.9-16.6 4.4-27.6 20.3-24.5 35.5 3.1 15.2 19 24 35.6 19.6 16.6-4.4 27.6-20.3 24.5-35.5-.2-1-.5-2-.8-3v-87.8l80-51.5v71.9c-6.1-3.1-13.4-3.9-20.9-1.9-16.6 4.4-27.6 20.3-24.5 35.5 3.1 15.2 19 24 35.6 19.6 16.6-4.4 27.6-20.3 24.5-35.5-.2-1-.5-2-.8-3v-120c0-3.3-1.7-6.4-4.5-8.2-4.5-2.9-9.5-3.6-14.2-1.8z"
                />
              </g>
            )}
          </svg>
        </button>
      </div>
      <div id="youtube-player" style={{ display: "none" }} />
    </div>
  );
}

export default ScrollIndicator;
