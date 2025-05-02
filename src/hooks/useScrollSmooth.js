import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollSmooth = (smoothness = 1) => {
  useGSAP(() => {
    let lastY = window.scrollY;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const targetY =
          self.progress *
          (document.documentElement.scrollHeight - window.innerHeight);

        if (Math.abs(lastY - targetY) > 1) {
          gsap.to(window, {
            duration: smoothness,
            ease: "power2.out",
            onUpdate: () => {
              window.scrollTo({
                top: targetY,
                behavior: "auto",
              });
            },
            overwrite: true,
          });
          lastY = targetY;
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [smoothness]);
};
