import CosmicBackground from "./components/CosmicBackground";
import ScrollIndicator from "./components/ScrollIndicator";
import SpiralIntro from "./components/SpiralIntro";
import PranaSphere from "./components/PranaSphere";
import StarCruise from "./components/StarCruise";
import LandscapeBlocker from "./components/LandscapeBlocker";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

function App() {
  // Adjust smoothness:
  // Lower values = smoother (0.05 - 0.1)
  // Higher values = faster (0.2 - 0.5)
  useSmoothScroll(3);

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
