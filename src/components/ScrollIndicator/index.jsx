import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  const musicRef = useRef(null);

  const handleDownloadCV = () => window.open(resumePDF, "_blank");

  useGSAP(() => {
    const svg = svgRef.current;
    const circle = circleRef.current;
    const track = trackRectRef.current;
    const container = scrollContainerRef.current;
    if (!svg || !circle || !track || !container) return;

    gsap.set(svg, { transformOrigin: "center", scale: 1 });

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
        end: "bottom top",
        scrub: 0.4,
      },
      scale: 0,
    });

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
        end: "bottom top",
        scrub: 0.4,
        toggleActions: "play reverse play reverse",
      },
      y: 100,
      opacity: 0,
    });

    // Animate SVG and Resume both ways
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.to(svg, { scale: 0, autoAlpha: 0, ease: "power2.out" }, 0).to(
      downloadCv.current,
      { y: 100, autoAlpha: 0, ease: "power2.out" },
      0
    );

    // Animate music button IN only (no reverse)
    gsap.fromTo(
      musicRef.current,
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          toggleActions: "play none none none", // Only play, no reverse
          // No scrub!
        },
      }
    );
  }, []);

  return (
    <div ref={scrollContainerRef} className="relative w-screen h-[100vh]">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
        <svg
          ref={svgRef}
          width="40"
          height="90"
          viewBox="0 0 50 130"
          xmlns="http://www.w3.org/2000/svg"
          style={{ willChange: "transform" }}
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
      <div ref={musicRef} className="fixed top-8 right-8 z-20">
        <MusicIndicator />
      </div>
    </div>
  );
}

export default ScrollIndicator;
