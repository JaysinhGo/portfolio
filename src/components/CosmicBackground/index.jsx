import { stars, twinkling, clouds } from "./styles.module.css";

function CosmicBackground() {
  return (
    <div className="cosmic-background">
      <div
        className={`${stars} fixed inset-0 w-full h-full block bg-black`}
      ></div>
      <div className={`${twinkling} fixed inset-0 w-full h-full block`}></div>
      <div
        className={`${clouds} fixed inset-0 w-full h-full block opacity-[0.4]`}
      ></div>
    </div>
  );
}

export default CosmicBackground;
