// src/components/LebanonFlag.jsx
// The Lebanese flag as a tiny inline SVG. Sized by the surrounding text (1em tall).
import React from "react";

import { cx } from "./utils";

const RED = "#ED1C24";
const GREEN = "#00A651";

// Cedar, centred on x = 75 in a 150 x 100 flag: flat tiers widening toward the base
const CEDAR =
  "M75 25 L81 31 L77.5 32.2 L85.5 38 L79.5 39.2 L90 45 L82 46.2 L94.5 52 " +
  "L84 53.2 L98 59 L86 60.2 L101.5 66.5 Q86 68 79.2 67.6 L79.8 74 L70.2 " +
  "74 L70.8 67.6 Q64 68 48.5 66.5 L64 60.2 L52 59 L66 53.2 L55.5 52 L68 " +
  "46.2 L60 45 L70.5 39.2 L64.5 38 L72.5 32.2 L69 31 Z";

export default function LebanonFlag({ className }) {
  return (
    <svg
      viewBox="0 0 150 100"
      role="img"
      aria-label="Lebanon"
      className={cx("inline-block h-[1em] w-auto rounded-[0.12em] ring-1 ring-black/10", className)}
    >
      <rect width="150" height="100" fill="#fff" />
      <rect width="150" height="25" fill={RED} />
      <rect y="75" width="150" height="25" fill={RED} />
      <path d={CEDAR} fill={GREEN} />
    </svg>
  );
}
