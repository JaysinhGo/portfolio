import CosmicBackground from "./components/CosmicBackground";
import ScrollIndicator from "./components/ScrollIndicator";
import SpiralIntro from "./components/SpiralIntro";
import PranaSphere from "./components/PranaSphere";
import StarCruise from "./components/StarCruise";
import LandscapeBlocker from "./components/LandscapeBlocker";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css"; // Optional but recommended

function useLenisSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.5, // 0.1-0.2 is smooth and fast; tweak as needed
      smoothWheel: true,
      smoothTouch: true, // set to true if you want smooth on touch devices
      autoRaf: true, // Let Lenis handle requestAnimationFrame automatically
    });

    // Optional: listen to scroll events
    // lenis.on("scroll", (e) => {
    //   console.log(e);
    // });

    return () => {
      lenis.destroy();
    };
  }, []);
}

function App() {
  useLenisSmoothScroll();

  return (
    <>
      <LandscapeBlocker />
      <CosmicBackground />
      <ScrollIndicator />
      <SpiralIntro />
      <PranaSphere />
      <StarCruise />
    </>
  );
}

export default App;
