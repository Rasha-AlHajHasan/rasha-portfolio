// src/components/DeviceShowcase.jsx
// Home hero visual: a quiet, self-running summary of what I build.
// One phone, with code typed on its screen (Flutter, then C# / .NET) before the
// app says hello. No controls; it pauses while off screen and only cross-fades
// (no typing, no movement) when reduced motion is requested.
import React, { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { t } from "../content/text";
import { SplashContext } from "./splash";
import TypedLines from "./TypedLines";
import { cx, EASE } from "./utils";

const SCENE_MS = 6400;
const REDUCED_SCENE_MS = 8000;

// Bezel and code pane stay dark in both themes, like real hardware
const BEZEL = "bg-[#1C1C1F] ring-1 ring-black/5 dark:ring-white/10";

// Syntax colors for the dark code pane
const KEY = "text-[#D6808E]";
const STR = "text-[#EBC7CD]";
const TYPE = "text-white/85";
const PUNC = "text-white/50";
const NOTE = "text-white/35 italic";

const SNIPPETS = [
  [
    [[NOTE, "// main.dart"]],
    [[KEY, "void "], [TYPE, "main"], [PUNC, "() =>"]],
    [[TYPE, "  runApp"], [PUNC, "("], [TYPE, "Text"], [PUNC, "("]],
    [[STR, "    'Hello, world!'"], [PUNC, ","]],
    [[PUNC, "  ));"]],
  ],
  [
    [[NOTE, "// Program.cs · .NET"]],
    [[TYPE, "app"], [PUNC, "."], [TYPE, "MapGet"], [PUNC, "("], [STR, '"/"'], [PUNC, ","]],
    [[PUNC, "  () =>"]],
    [[STR, '  "Hello, world!"'], [PUNC, ");"]],
    [[TYPE, "app"], [PUNC, "."], [TYPE, "Run"], [PUNC, "();"]],
  ],
];

// --------------------------------------------------------------------------
// Clock: advances the snippet, pauses when hidden, off screen or under the splash
// --------------------------------------------------------------------------

function useSceneClock(ref, duration, ready) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!visible || !ready) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % SNIPPETS.length);
    }, duration);
    return () => clearInterval(id);
  }, [visible, ready, duration]);

  return index;
}

// --------------------------------------------------------------------------
// The screen: code is typed, then the app says hello
// --------------------------------------------------------------------------

function PhoneScreen({ code, reduced }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute inset-x-0 bottom-0 top-[12%] flex flex-col"
    >
      {/* Code */}
      <div className="mx-[6%] whitespace-pre rounded-[1.6cqw] bg-[#141416] px-[4%] py-[6%] font-mono text-[1.9cqw] leading-[1.65]">
        <TypedLines lines={code} reduced={reduced} speed={32} caretClass="bg-white/70" />
      </div>

      {/* The running app */}
      <div className="grid flex-1 place-content-center justify-items-center gap-[1.6cqw] px-[6%] pb-[12%]">
        <p className="script whitespace-nowrap text-[4.6cqw] text-ink">
          <TypedLines
            lines={[[["", "Hello, world!"]]]}
            reduced={reduced}
            delay={2700}
            speed={60}
            keepCaret
            caretClass="ml-[0.1em] bg-wine"
          />
        </p>
        <motion.span
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 3.4, ease: EASE }}
          className="h-px w-[40%] origin-left bg-wine/70"
        />
      </div>

      {/* Floating action button, as in Flutter's starter app */}
      <motion.div
        initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: reduced ? 0 : 3.4, ease: EASE }}
        className="absolute bottom-[4%] right-[8%] grid aspect-square w-[18%] place-items-center rounded-[30%] bg-wine text-[3cqw] font-light leading-none text-white shadow-md"
      >
        +
      </motion.div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------
// Showcase
// --------------------------------------------------------------------------

export default function DeviceShowcase() {
  const ready = useContext(SplashContext);
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const index = useSceneClock(rootRef, reduced ? REDUCED_SCENE_MS : SCENE_MS, ready);

  return (
    <figure ref={rootRef}>
      {/* One static sentence for screen readers instead of a changing visual */}
      <figcaption className="sr-only">{t("showcase.summary")}</figcaption>

      {/* Stage: burgundy baseline, plus a grey disc behind the phone */}
      <div aria-hidden className="relative mx-auto aspect-[4/3] w-full max-w-[34rem] [container-type:inline-size]">
        <div className="absolute inset-x-[10%] bottom-[4%] top-[2%] rounded-full bg-surface/80 dark:bg-surface/60" />
        <div className="absolute inset-x-[6%] bottom-[4%] h-px bg-wine/60" />

        <div className="absolute inset-0 flex items-end justify-center pb-[4%]">
          <div className={cx("relative h-[90%] rounded-[8cqw] p-[1.2cqw] shadow-device", BEZEL)} style={{ aspectRatio: "9 / 19" }}>
            <div className="absolute left-1/2 top-[2.4%] z-10 h-[2.2%] w-[30%] -translate-x-1/2 rounded-full bg-[#1C1C1F]" />

            <div className="relative h-full overflow-hidden rounded-[6.8cqw] bg-surface text-ink">
              {/* Status bar */}
              <div className="flex items-center justify-between px-[9%] pt-[7%] text-[clamp(6px,1.6cqw,9px)] font-medium tabular-nums text-ink-soft">
                <span>9:41</span>
                <span className="flex items-end gap-[2px]">
                  <span className="h-[3px] w-[2px] rounded-sm bg-ink-soft" />
                  <span className="h-[5px] w-[2px] rounded-sm bg-ink-soft" />
                  <span className="h-[7px] w-[2px] rounded-sm bg-ink-soft" />
                </span>
              </div>

              <AnimatePresence mode="wait">
                {ready && <PhoneScreen key={index} code={SNIPPETS[index]} reduced={reduced} />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
