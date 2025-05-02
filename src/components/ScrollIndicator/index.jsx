import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import resumePDF from "../../assets/JaysinhGohil-LeadWebDeveloper.pdf";
import MusicIndicator from "./MusicIndicator";

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
    <div ref={scrollContainerRef} className="relative w-screen h-[200vh]">
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
      <div className="fixed top-0 right-0 items-center justify-center gap-2 mt-6 mr-6 z-11">
        <MusicIndicator />
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
      <div id="youtube-player" style={{ display: "none" }} />
    </div>
  );
}

export default ScrollIndicator;
