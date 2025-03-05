import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NebulaNest from "../NebulaNest";
gsap.registerPlugin(ScrollTrigger);

const GalacticRide = () => {
  return (
    <>
      <NebulaNest />
    </>
  );
};

export default GalacticRide;
