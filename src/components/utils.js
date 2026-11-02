// src/components/utils.js

export const cx = (...classes) => classes.filter(Boolean).join(" ");

// Shared easing curve for Framer Motion transitions
export const EASE = [0.2, 0.7, 0.2, 1];

// Mirrors arrows and chevrons in the Arabic (RTL) layout
export const FLIP_RTL = "rtl:-scale-x-100";

// Accepts an array or a comma-separated string
export function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function isPlaceholderHref(href) {
  return (
    !href ||
    href === "https://wa.me/" ||
    href.endsWith("/in/") ||
    href.endsWith("github.com/") ||
    href === "https://github.com/" ||
    href === "https://www.linkedin.com/in/"
  );
}

export function isExternal(href) {
  return Boolean(href?.startsWith("http"));
}
