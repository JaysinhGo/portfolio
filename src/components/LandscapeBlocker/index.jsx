import { useState, useEffect } from "react";

const LandscapeBlocker = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if the device is mobile using screen width and user agent
      const isMobileDevice =
        /iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Check if screen is in landscape mode
      const isLandscapeMode = window.innerWidth > window.innerHeight;

      // Set landscape blocker if it's a mobile device in landscape mode
      if (isMobileDevice && isLandscapeMode) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    // Initial check
    checkOrientation();

    // Add event listeners
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    // Try to lock orientation on mobile
    const isMobileDevice =
      /iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobileDevice && window.screen?.orientation?.lock) {
      window.screen.orientation.lock("portrait").catch(() => {
        // Silently fail if locking is not supported
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        className="rotate-90"
      >
        <path
          d="M17 2.1L12 7M12 7L7 2.1M12 7V22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-white text-lg mt-4 text-center px-4">
        Please rotate your device to portrait mode
      </p>
    </div>
  );
};

export default LandscapeBlocker;
