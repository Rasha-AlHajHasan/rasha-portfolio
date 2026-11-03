// src/components/SplashIcons.jsx
// One-line drawings around the splash laptop, drawn stroke by stroke while the lid opens.
// The objects are Graphite; the Bordeaux Thread runs through each one (trail, tick, arrow).
import React, { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

import { cx, EASE } from "./utils";

const DRAW_EASE = [0.45, 0, 0.2, 1];
const DASHED_TRAIL_MASK = "splash-dashed-trail";

function Line({ d, delay, duration = 0.6, className }) {
  return (
    <motion.path
      d={d}
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { delay, duration, ease: DRAW_EASE }, opacity: { delay, duration: 0.01 } }}
    />
  );
}

// A craft flies along `trail` and leaves it drawn behind; both follow one progress value.
// Crafts are drawn with their tail at (0, 0) and nose towards +x.
function Flight({ trail, craft, delay, duration, dashed = false }) {
  const pathRef = useRef(null);
  const craftRef = useRef(null);
  const progress = useMotionValue(0);
  const opacity = useTransform(progress, [0, 0.001], [0, 1]);

  useEffect(() => {
    const unsubscribe = progress.on("change", (value) => {
      const path = pathRef.current;
      const length = path.getTotalLength();
      const at = length * value;
      const here = path.getPointAtLength(at);
      const behind = path.getPointAtLength(Math.max(0, at - 1));
      const ahead = path.getPointAtLength(Math.min(length, at + 1));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      craftRef.current.setAttribute("transform", `translate(${here.x} ${here.y}) rotate(${angle})`);
    });
    const flight = animate(progress, 1, { delay, duration, ease: DRAW_EASE });
    return () => {
      flight.stop();
      unsubscribe();
    };
  }, [progress, delay, duration]);

  return (
    <motion.g style={{ opacity }}>
      {dashed ? (
        <>
          {/* Dashes can't also be drawn on with pathLength, so a solid line reveals them */}
          <mask id={DASHED_TRAIL_MASK} maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="180">
            <motion.path ref={pathRef} d={trail} stroke="white" strokeWidth="6" style={{ pathLength: progress }} />
          </mask>
          <path d={trail} strokeDasharray="7 7" mask={`url(#${DASHED_TRAIL_MASK})`} className="text-wine-text" />
        </>
      ) : (
        <motion.path ref={pathRef} d={trail} className="text-wine-text" style={{ pathLength: progress }} />
      )}
      <g ref={craftRef} className="fill-canvas">
        {craft}
      </g>
    </motion.g>
  );
}

function PaperPlane() {
  return (
    <Flight
      delay={0.3}
      duration={1.8}
      trail="M4 130 C30 130 54 114 50 92 C47 74 24 76 27 94 C30 114 64 118 80 100 C94 84 86 62 72 66 C58 70 66 96 92 96 C104 96 112 88 120 82"
      craft={
        <>
          <path d="M64 0 L-1 -24 Q-6 -25 -4 -20 L5 -3 Q7 1 12 0 Z" />
          <path d="M64 0 L12 5 Q7 5.5 5 9 L-2 21 Q-4 26 1 24 Z" />
          <path d="M0 0 L5 -3" />
        </>
      }
    />
  );
}

function Airplane() {
  return (
    <>
      <Flight
        dashed
        delay={0.9}
        duration={1.8}
        trail="M4 106 C24 102 44 94 56 80 C68 66 72 46 58 42 C49 40 44 48 42 56 C39 47 28 41 22 50 C14 64 38 86 62 94 C80 100 102 98 118 90"
        craft={
          <path d="M0 -4 L-5 -14 L4 -14 L12 -4 L26 -4 L15 -32 L25 -32 L45 -4 L58 -4 Q66 -3 68 0 Q66 3 58 4 L45 4 L25 32 L15 32 L26 4 L12 4 L4 14 L-5 14 Z" />
        }
      />
      {[
        { d: "M154 34 C144 26 148 14 156 20 C164 14 168 26 154 34 Z", delay: 2.55 },
        { d: "M176 54 C170 49 172 42 177 45 C182 42 184 49 176 54 Z", delay: 2.7 },
      ].map(({ d, delay }) => (
        <motion.path
          key={d}
          d={d}
          className="text-wine-text"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay, type: "spring", stiffness: 320, damping: 14 }}
        />
      ))}
    </>
  );
}

const CALENDAR_CELLS = [
  [88, 58],
  [108, 58],
  [128, 58],
  [58, 78],
  [78, 78],
  [98, 78],
  [58, 98],
  [78, 98],
];

const cell = (x, y) => `M${x + 3} ${y} h9 q3 0 3 3 v8 q0 3 -3 3 h-9 q-3 0 -3 -3 v-8 q0 -3 3 -3 Z`;

function Calendar() {
  return (
    <>
      <Line
        delay={0.5}
        duration={1}
        d="M0 110 C14 108 28 112 42 114 L42 40 Q42 30 52 30 L142 30 Q152 30 152 40 L152 118 Q152 128 142 128 L52 128 Q42 128 42 118 L42 114"
      />
      <Line delay={1.2} duration={0.35} d="M74 38 C68 30 68 16 73 14 C78 12 81 22 80 30" />
      <Line delay={1.3} duration={0.35} d="M118 38 C112 30 112 16 117 14 C122 12 125 22 124 30" />
      {CALENDAR_CELLS.map(([x, y], i) => (
        <Line key={`${x}-${y}`} d={cell(x, y)} delay={1.35 + i * 0.07} duration={0.3} />
      ))}
      <Line delay={2} duration={0.7} className="text-wine-text" d="M112 100 L122 111 L140 88 C146 98 172 100 200 92" />
    </>
  );
}

const ring = (cx, cy, r) => `M${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r}`;

function Target() {
  return (
    <>
      <Line delay={0.7} duration={0.9} d="M0 136 C50 134 130 138 200 135" />
      {[58, 40, 23, 8].map((r, i) => (
        <Line key={r} d={ring(84, 76, r)} delay={0.8 + i * 0.25} duration={0.6} />
      ))}
      {/* The arrow flies in from up the shaft, then quivers from its tip */}
      <motion.g
        className="text-wine-text"
        initial={{ x: 62, y: -44, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.3, ease: "easeIn" }}
      >
        <motion.g
          style={{ originX: 0, originY: 1 }}
          animate={{ rotate: [0, 3, -2.5, 1.5, -0.8, 0] }}
          transition={{ delay: 2.3, duration: 0.6, ease: EASE }}
        >
          <path d="M84 76 L160 22" />
          <path d="M92 60 L84 76 L102 73" />
          <path d="M150 29 L152 11 L172 -1 L170 17 Z" />
          <path d="M150 29 L168 31 L188 19 L170 17" />
        </motion.g>
      </motion.g>
    </>
  );
}

const SKETCHES = [
  { Sketch: PaperPlane, place: "left-[max(1rem,calc(50%-29rem))] top-[max(1.5rem,calc(50%-17rem))]" },
  { Sketch: Calendar, place: "right-[max(1rem,calc(50%-29rem))] top-[max(1.5rem,calc(50%-17rem))]" },
  { Sketch: Target, place: "left-[max(1rem,calc(50%-29rem))] bottom-[max(1.5rem,calc(50%-17rem))]" },
  { Sketch: Airplane, place: "right-[max(1rem,calc(50%-29rem))] bottom-[max(1.5rem,calc(50%-17rem))]" },
];

// Left out on short screens, where the laptop leaves no room around it
export default function SplashIcons() {
  return SKETCHES.map(({ Sketch, place }) => (
    <svg
      key={place}
      viewBox="0 0 200 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("absolute w-[clamp(5.5rem,24vmin,11rem)] overflow-visible text-ink [@media(max-height:480px)]:hidden", place)}
    >
      <Sketch />
    </svg>
  ));
}
