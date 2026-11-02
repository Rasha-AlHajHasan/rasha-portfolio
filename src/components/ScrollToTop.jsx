// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Instant: a smooth scroll would fight the page transition
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
