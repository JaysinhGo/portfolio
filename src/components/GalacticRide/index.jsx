import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GalacticRide = () => {
  return <div className="relative w-screen h-[1000vh]"></div>;
};

export default GalacticRide;
