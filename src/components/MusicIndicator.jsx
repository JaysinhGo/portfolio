import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const YOUTUBE_VIDEO_ID = "6lDEyKA5I40"; // Your YouTube video ID

// Your getRandomHSL function
const getRandomHSL = () => {
  const hue = Math.random() * 360;
  const saturation = Math.random() * 20 + 80; // 80-100%
  const lightness = Math.random() * 30 + 55; // 55-85%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function MusicIndicator() {
  const [icon, setIcon] = useState("play");
  const [playerReady, setPlayerReady] = useState(false);
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const planetRef = useRef(null);
  const playIconRef = useRef(null);
  const ellipseRef = useRef();

  useEffect(() => {
    let scriptTag;
    let checkYTLoadedInterval;

    function createPlayer() {
      if (!window.YT || !window.YT.Player) return;
      playerRef.current = new window.YT.Player("youtube-music-player", {
        height: "0",
        width: "0",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
          },
          onError: (e) => {
            console.error("YouTube Player error", e);
          },
        },
      });
    }

    // If YT is already loaded, create the player
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Otherwise, load the script and poll for YT to be ready
      scriptTag = document.createElement("script");
      scriptTag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(scriptTag);

      checkYTLoadedInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYTLoadedInterval);
          createPlayer();
        }
      }, 100);
    }

    // Infinite rotation
    gsap.to(planetRef.current, {
      rotate: 360,
      repeat: -1,
      duration: 3, // seconds for one full rotation
      ease: "linear",
      transformOrigin: "50% 50%",
    });

    const interval = setInterval(() => {
      if (playIconRef.current) {
        playIconRef.current.setAttribute("fill", getRandomHSL());
      }
    }, 500); // Change color every 500ms

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (checkYTLoadedInterval) {
        clearInterval(checkYTLoadedInterval);
      }
      if (scriptTag) {
        scriptTag.remove();
      }
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let frame;
    const start = Date.now();
    function animate() {
      const elapsed = ((Date.now() - start) / 1000) % 1;
      if (ellipseRef.current) {
        ellipseRef.current.setAttribute("fill", getShiningColor(elapsed));
      }
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  function getShiningColor(progress) {
    const hue = (progress * 1080) % 360;
    return `hsl(${hue}, 100%, 60%)`;
  }

  const handleClick = () => {
    if (!playerReady || !playerRef.current) return;

    if (icon === "play") {
      playerRef.current.unMute();
      playerRef.current.playVideo();
      setIcon("music");
    } else if (icon === "music") {
      playerRef.current.mute();
      setIcon("mute");
    } else if (icon === "mute") {
      playerRef.current.unMute();
      setIcon("music");
    }
  };

  useGSAP(() => {
    ScrollTrigger.create({
      onUpdate: (self) => {
        const progress = self.progress; // 0 to 1
        ellipseRef.current.setAttribute("fill", getShiningColor(0, progress));
      },
    });
  }, []);

  return (
    <>
      <button
        aria-label="Toggle music"
        onClick={handleClick}
        className="relative bg-transparent border-none cursor-pointer p-0 outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 79 79"
          className="w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] lg:w-[60px] lg:h-[60px]"
        >
          <g id="Layer_2">
            <g
              id="Layer_1-2"
              ref={planetRef}
              className={icon === "music" ? "opacity-50" : ""}
            >
              {/* Main disc and background */}
              <path
                d="M70.8 36.32a32.93 32.93 0 0 1-33.1 33 33.32 33.32 0 0 1-10.4-1.7 8 8 0 0 0-4.8-3.4 7 7 0 0 0-2.9-.3 33.17 33.17 0 0 1-13.2-38.3c2.3-.5 3.9-1.9 3.8-3.3a2.79 2.79 0 0 0-1.4-2.1 33.06 33.06 0 0 1 58.7 1.7l-.2.2a5.55 5.55 0 0 0-.8 7.8 5.26 5.26 0 0 0 2.8 1.8c.3.1.5.1.8.2h.3a22.51 22.51 0 0 1 .4 4.4z"
                style={{ fill: "var(--scroll-indicator-fill)" }}
              />
              <path
                d="M70.3 36.32a32.44 32.44 0 0 1-32.5 32.5 33.18 33.18 0 0 1-10.3-1.7 7.5 7.5 0 0 0-4.7-3.3 6.72 6.72 0 0 0-2.8-.3h-.1a32.56 32.56 0 0 1-13-37.6c2.2-.5 3.8-1.8 3.7-3.3a2.47 2.47 0 0 0-1.4-2 32.55 32.55 0 0 1 57.8 1.7l-.2.2a5.41 5.41 0 0 0-.8 7.6 5.26 5.26 0 0 0 2.8 1.8c.3.1.5.1.8.2h.3c.2 1.4.3 2.8.4 4.2z"
                style={{ fill: "var(--scroll-indicator-shade-10)" }}
              />
              <ellipse
                cx="52.18"
                cy="58.11"
                rx="6"
                ry="4.6"
                style={{ fill: "var(--scroll-indicator-shade-20)" }}
                transform="rotate(-30.83 52.173 58.113)"
              />
              <ellipse
                cx="52.51"
                cy="58.71"
                rx="6"
                ry="4.4"
                style={{ fill: "var(--scroll-indicator-shade-40)" }}
                transform="rotate(-30.83 52.514 58.714)"
              />
              <ellipse
                cx="52.31"
                cy="58.42"
                rx="6"
                ry="4.4"
                style={{ fill: "var(--scroll-indicator-shade-60)" }}
                transform="rotate(-30.83 52.32 58.427)"
              />
              <ellipse
                ref={ellipseRef}
                cx="51.8"
                cy="57.52"
                rx="5.2"
                ry="3.4"
                transform="rotate(-30.83 51.79 57.52)"
              />
              <path
                d="M69.6 32.12a2.35 2.35 0 0 1-.8-.2 5.45 5.45 0 0 1-3.8-6.7 5.26 5.26 0 0 1 1.8-2.8 32.56 32.56 0 0 0-16.4-15.9 63 63 0 0 1 7.2 29.8 68.63 68.63 0 0 1-2.1 16.9 4.06 4.06 0 0 1 2.3 1.6c0 .1.1.1.1.2l.1.1.1.1.1.1c1.3 2.2.1 5.4-2.8 7a7.71 7.71 0 0 1-3.6 1.2A19.65 19.65 0 0 1 50.5 66a32.3 32.3 0 0 0 19.1-33.9z"
                style={{ fill: "var(--scroll-indicator-fill)" }}
              />
            </g>
            {/* Play icon */}
            {icon === "play" && (
              <g>
                <path
                  d="M51.9 34.82l-20.1-10a3.61 3.61 0 0 0-4.8 1.5 2.93 2.93 0 0 0-.4 1.6V48a3.54 3.54 0 0 0 3.5 3.5 2.93 2.93 0 0 0 1.6-.4l20.1-10a3.56 3.56 0 0 0 1.6-4.7 3.86 3.86 0 0 0-1.5-1.58z"
                  style={{ fill: "var(--scroll-indicator-shade-10)" }}
                />
                <path
                  d="M52.6 32.62L30.8 22a4 4 0 0 0-5.2 1.6 3.29 3.29 0 0 0-.4 1.7v21.2a3.8 3.8 0 0 0 3.9 3.7 3.92 3.92 0 0 0 1.8-.4l21.8-10.6a3.67 3.67 0 0 0 1.8-4.8c0-.1-.1-.1-.1-.2a5.6 5.6 0 0 0-1.8-1.58z"
                  style={{ fill: "var(--scroll-indicator-shade-20)" }}
                />
                <path
                  d="M53.1 34L31 23.42A4.05 4.05 0 0 0 25.7 25a3.29 3.29 0 0 0-.4 1.7v21.2a3.8 3.8 0 0 0 3.9 3.7 3.92 3.92 0 0 0 1.8-.4l22.1-10.6a3.68 3.68 0 0 0 1.9-4.8.35.35 0 0 0-.1-.2 4.55 4.55 0 0 0-1.8-1.6z"
                  style={{ fill: "var(--scroll-indicator-shade-40)" }}
                />
                <path
                  d="M53.1 33.22l-21.8-10.6a4 4 0 0 0-5.2 1.6 3.29 3.29 0 0 0-.4 1.7v21.2a3.8 3.8 0 0 0 3.9 3.7 3.92 3.92 0 0 0 1.8-.4l21.8-10.6A3.67 3.67 0 0 0 55 35c0-.1-.1-.1-.1-.2a5.48 5.48 0 0 0-1.8-1.58z"
                  style={{
                    fill: "var(--scroll-indicator-white-replacement)",
                  }}
                />
              </g>
            )}
            {/* Music icon */}
            {icon === "music" && (
              <g>
                <path
                  d="M45.4 25.52L44.9 29a.9.9 0 0 1-1.1.9.37.37 0 0 1-.3-.1l-2.9-1.3a1 1 0 0 0-1.3.5.85.85 0 0 0 0 .7L41 42v.2a4.87 4.87 0 0 1 .1 1.2c0 3-2.9 5.5-6.4 5.5a6.9 6.9 0 0 1-4.4-1.5c-.2-.2-.4-.3-.6-.5a4.76 4.76 0 0 1-1.4-3.4c0-3 2.9-5.5 6.4-5.5h.3l-.8-6-1-7.1a3.14 3.14 0 0 1 2.4-3.6l.6-.1h1.1l.8.2 4.9 2.1 1.8.7h.1c.2.1.4.2.4.4a2.77 2.77 0 0 1 .1.92z"
                  style={{ fill: "var(--scroll-indicator-shade-40)" }}
                />
                <path
                  d="M47.2 26.42l-.6 3.7a1.19 1.19 0 0 1-1.2 1c-.1 0-.2 0-.2-.1l-3.2-1.3a1.08 1.08 0 0 0-1.4.7.64.64 0 0 0 0 .6l1.9 13.1v.2a5 5 0 0 1 .2 1.2c0 3.2-3.1 5.8-7 5.8a8.44 8.44 0 0 1-4.9-1.6c-.2-.2-.5-.4-.6-.6a5.33 5.33 0 0 1-1.5-3.6c0-3.2 3.1-5.8 7-5.8h.3l-.9-6.4-1.1-7.5A3.3 3.3 0 0 1 36.6 22l.6-.1h1.2l.9.2 5.4 2.2 1.9.8h.1a1.21 1.21 0 0 1 .5.5 2.13 2.13 0 0 1 0 .82z"
                  style={{ fill: "var(--scroll-indicator-shade-20)" }}
                />
                <path
                  d="M46.5 26l-.5 3.6a1 1 0 0 1-1.2.9c-.1 0-.2 0-.2-.1l-3.1-1.3a1.08 1.08 0 0 0-1.4.7.64.64 0 0 0 0 .6l1.8 12.8v.2a4.87 4.87 0 0 1 .1 1.2c0 3.1-3 5.6-6.7 5.6a7.43 7.43 0 0 1-4.7-1.6L30 48a5 5 0 0 1-1.4-3.5c0-3.1 3-5.6 6.7-5.6h.3l-.9-6.2-1-7.3a3.18 3.18 0 0 1 2.5-3.7l.6-.1h1.1l.9.2 5.2 2.1 1.9.8h.1a1 1 0 0 1 .5.4 1.38 1.38 0 0 1 0 .9z"
                  style={{ fill: "var(--scroll-indicator-shade-10)" }}
                />
                <path
                  ref={playIconRef}
                  d="M45.7 25.62l-.5 3.5a.9.9 0 0 1-1.1.9.37.37 0 0 1-.3-.1l-2.9-1.2a1 1 0 0 0-1.3.5.85.85 0 0 0 0 .7l1.7 12.3v.2a4.87 4.87 0 0 1 .1 1.2c0 3-2.9 5.5-6.4 5.5a6.9 6.9 0 0 1-4.4-1.5c-.2-.2-.4-.3-.6-.5a4.76 4.76 0 0 1-1.4-3.4c0-3 2.9-5.5 6.4-5.5h.3l-.8-6-1-7a3.14 3.14 0 0 1 2.4-3.6l.6-.1h1.1l.8.2 4.9 2.1 1.8.7h.1c.2.1.4.2.4.4a.76.76 0 0 1 .1.7z"
                  // style={{
                  //   fill: "var(--scroll-indicator-white-replacement)",
                  // }}
                />
              </g>
            )}
            {/* Mute icon */}
            {icon === "mute" && (
              <g>
                <path
                  d="M40.4 43.62c0 3-2.8 5.4-6.2 5.5H34a7.38 7.38 0 0 1-4.5-1.5c-.2-.2-.4-.3-.6-.5a3.81 3.81 0 0 1-.9-1.3c0-.1-.1-.2-.1-.3a5.84 5.84 0 0 1-.4-1.8c0-3 2.9-5.5 6.4-5.5h.3l-.3-2.3.4.5.2.3.2.2 5.6 6.4c.1 0 .1.1.1.3zM44.7 25.52 44.2 29a.92.92 0 0 1-1 .9.37.37 0 0 1-.3-.1L40 28.62a1 1 0 0 0-1.3.5.85.85 0 0 0 0 .7l.8 5.6L33.9 29l-.2-.2-.2-.3-.4-.5-.4-3.1a3.14 3.14 0 0 1 2.4-3.6l.6-.1h1.1l.8.2.2.1 4.7 2 1.8.7h.1c.1 0 .1.1.2.1l.3.3c-.2.4-.1.62-.2.92z"
                  style={{ fill: "var(--scroll-indicator-shade-10)" }}
                />
                <path
                  d="M41.9 45.52c0 3.2-3.1 5.8-7 5.8a7.91 7.91 0 0 1-4.8-1.6c-.2-.2-.5-.4-.6-.6a4.91 4.91 0 0 1-1.5-3.6v-.4a.9.9 0 0 1 .1-.5c.5-2.8 3.4-4.9 6.9-4.9h.3l-.4-2.9 5.6 6.4.4.4.6.7.5.5c-.2.18-.1.5-.1.7zM46.6 26.42l-.6 3.7a1.11 1.11 0 0 1-1.2 1c-.1 0-.2 0-.2-.1l-3.2-1.3a1.08 1.08 0 0 0-1.4.7.64.64 0 0 0 0 .6l.9 6.1-.5-.5-.5-.6-.4-.5-5.6-6.4-.5-3.2a3.3 3.3 0 0 1 2.6-3.8l.6-.1h1.2l.9.2 5.4 2.2.4.1.4.2.7.3.5.2h.1a1.21 1.21 0 0 1 .5.5c-.1.1-.1.4-.1.7z"
                  style={{ fill: "var(--scroll-indicator-shade-20)" }}
                />
                <path
                  d="M41.4 44.52c0 3.1-3 5.6-6.7 5.6a7.43 7.43 0 0 1-4.7-1.6l-.6-.6a5.64 5.64 0 0 1-1.3-2.4 1.27 1.27 0 0 1-.1-.6v-1c.3-2.9 3.2-5.2 6.7-5.2h.3l-.3-2.4.2.2 5.6 6.4.4.4.6.7a1.34 1.34 0 0 0-.1.5zM45.9 26l-.5 3.6a1.16 1.16 0 0 1-1.1 1 .37.37 0 0 1-.3-.1l-3.1-1.3a1.08 1.08 0 0 0-1.4.7.64.64 0 0 0 0 .6l.9 6.1-.5-.6-.4-.5-5.6-6.4-.2-.2-.5-3.3a3.23 3.23 0 0 1 2.5-3.7l.6-.1h1.1l.9.2 5.2 2.1.8.3.6.2.5.2h.1l.1.1a1.38 1.38 0 0 1 .3.4z"
                  style={{ fill: "var(--scroll-indicator-shade-40)" }}
                />
                <path
                  d="M40.8 43.62c0 3-2.9 5.5-6.4 5.5h-.2a7.23 7.23 0 0 1-4.3-1.5c-.2-.2-.4-.3-.6-.5a5.64 5.64 0 0 1-1.3-2.4c0-.2-.1-.3-.1-.5v-.5c0-3 2.9-5.5 6.4-5.5h.3l-.3-1.9.2.3.2.2 5.6 6.4zM45.1 25.62l-.5 3.5a.9.9 0 0 1-1.1.9.37.37 0 0 1-.3-.1l-2.9-1.2c-.1 0-.2-.1-.3-.1a1 1 0 0 0-1 1.1v.1l.8 6-.4-.5-5.6-6.4-.2-.2-.2-.3-.5-3.42a3.14 3.14 0 0 1 2.4-3.6l.6-.1H37l.7.1h.2l4.9 2.1 1.8.7h.1a.35.35 0 0 1 .2.1l.1.1c.1.1.1.2.2.3a3.08 3.08 0 0 0-.1.92z"
                  style={{
                    fill: "var(--scroll-indicator-white-replacement)",
                  }}
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="url(#linear-gradient)"
                  d="m46.9 50.52-21-23.8a2.29 2.29 0 0 1 .2-3 1.9 1.9 0 0 1 2.7-.1l.1.1 21 23.8a2.29 2.29 0 0 1-.2 3 2 2 0 0 1-2.8 0z"
                  style={{ fill: "url(#linear-gradient)" }}
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m46.1 49.62-19.9-22.8a2.16 2.16 0 0 1 .3-2.9 1.91 1.91 0 0 1 2.7-.2l.1.1 19.9 22.8a2.16 2.16 0 0 1-.3 2.9 1.93 1.93 0 0 1-2.8.1z"
                  style={{
                    fill: "var(--scroll-indicator-white-replacement)",
                  }}
                />
                <linearGradient id="linear-gradient">
                  <stop
                    offset="0%"
                    style={{
                      stopColor: "var(--scroll-indicator-fill)",
                      stopOpacity: 1,
                    }}
                  />
                  <stop
                    offset="100%"
                    style={{
                      stopColor: "var(--scroll-indicator-fill)",
                      stopOpacity: 0.5,
                    }}
                  />
                </linearGradient>
              </g>
            )}
          </g>
        </svg>
      </button>
      <audio ref={audioRef} loop />
      <div id="youtube-music-player" style={{ display: "none" }} />
    </>
  );
}
