import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function getScreenSize(width: number) {
  if (width < 600) return "xs";
  if (width < 900) return "s";
  if (width < 1200) return "md";
  if (width < 1536) return "lg";
  return "xl";
}

export default function useWindowDimensions() {
  const [screenSize, setScreenSize] = useState(
    getScreenSize(getWindowDimensions().width)
  );

  useEffect(() => {
    function handleResize() {
      setScreenSize(getScreenSize(getWindowDimensions().width));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}
