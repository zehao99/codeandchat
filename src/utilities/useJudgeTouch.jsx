import { useState, useEffect } from "react";

/**
 * React hook for testing if the device is mobile device.
 */

export function getJudgeTouch() {
  const { userAgent, maxTouchPoints, platform } = navigator;
  let isTouch = false;
  // All Multi-TouchDevice
  if(  userAgent.indexOf("Android") > -1 || userAgent.indexOf("Adr") > -1 || (!!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))){
    isTouch = true;
  }

  if (navigator.platform === "iPad" ||
    (navigator.platform === "MacIntel")) {
    // iPad
    isTouch = false;
  }
  return {
    isTouch,
  };
}

export default function useJudgeTouch() {
  const [isTouch, setIsTouch] = useState(
    getJudgeTouch()
  );

  useEffect(() => {
    // For testing on desktop Chrome
    function handleResize() {
        setIsTouch(getJudgeTouch());
      }
    window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isTouch;
}
