import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NebulaNest = () => {
  const containerRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden h-[2000vh]"
    ></div>
  );
};

export default NebulaNest;
