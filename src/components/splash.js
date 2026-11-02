// src/components/splash.js
import { createContext } from "react";

export const SPLASH_STORAGE_KEY = "splash:seen";

// False while the splash covers the page, so the hero can wait before it starts typing
export const SplashContext = createContext(true);

// Once per browser session, never with reduced motion
export function shouldShowSplash() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem(SPLASH_STORAGE_KEY);
  } catch {
    return true;
  }
}
