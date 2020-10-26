import { useState, useEffect } from "react";


export function getJudgeTouch() {
  const { userAgent, maxTouchPoints } = navigator;
  return {
    isTouch: maxTouchPoints > 1 || userAgent.indexOf("Android") > -1 || userAgent.indexOf("Adr") > -1 || !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  };
}

export default function useWindowDimensions() {
  const [isTouch, setIsTouch] = useState(
    getJudgeTouch()
  );

  useEffect(() => {
    function handleResize() {
        setIsTouch(getJudgeTouch());
      }
    window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isTouch;
}
