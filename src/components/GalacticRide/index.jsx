import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NebulaNest from "../NebulaNest";
gsap.registerPlugin(ScrollTrigger);

const GalacticRide = () => {
  return (
    <>
      <div className="relative w-screen h-screen"></div>
      <NebulaNest />
    </>
  );
};

export default GalacticRide;
