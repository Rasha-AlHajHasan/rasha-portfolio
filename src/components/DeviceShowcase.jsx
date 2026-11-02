// src/components/DeviceShowcase.jsx
// Home hero visual: a quiet, self-running summary of what I build.
// Three scenes loop on their own — phone (Flutter), laptop (C# / .NET code),
// browser window (responsive web). No controls; it pauses while off screen and
// only cross-fades (no typing, no movement) when reduced motion is requested.
import React, { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useI18n } from "../i18n/context";
import { cx, EASE } from "./utils";

const SCENES = ["mobile", "software", "web"];
const SCENE_MS = 5600;
const REDUCED_SCENE_MS = 8000;

// Bezel and editor stay dark in both themes, like real hardware
const BEZEL = "bg-[#1C1C1F] ring-1 ring-black/5 dark:ring-white/10";

// Sizes inside the stage follow the stage width (container query units)
const CHIP_TEXT = "text-[clamp(10px,2.3cqw,12px)]";

// --------------------------------------------------------------------------
// Clock: advances the scene, pauses when hidden or off screen
// --------------------------------------------------------------------------

function useSceneClock(ref, duration) {
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
    if (!visible) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % SCENES.length);
    }, duration);
    return () => clearInterval(id);
  }, [visible, duration]);

  return index;
}

// --------------------------------------------------------------------------
// Small pieces
// --------------------------------------------------------------------------

function Chip({ children, className, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={cx(
        "absolute z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-1 font-medium text-ink shadow-sm",
        CHIP_TEXT,
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-wine" />
      {children}
    </motion.span>
  );
}

// Characters appear one by one; the full text is shown at once with reduced motion
function Typed({ text, reduced, delay = 0.4, step = 0.07 }) {
  return (
    <>
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01, delay: reduced ? 0 : delay + i * step }}
        >
          {char}
        </motion.span>
      ))}
      <span className="showcase-caret ms-[0.08em] inline-block h-[0.8em] w-px translate-y-[0.1em] bg-wine" />
    </>
  );
}

// --------------------------------------------------------------------------
// Scene 1 — phone: a minimal Flutter app saying hello
// --------------------------------------------------------------------------

function MobileScene({ reduced }) {
  return (
    <>
      <Chip className="start-[13%] top-[24%]" delay={0.9}>Flutter</Chip>
      <Chip className="end-[14%] top-[46%]" delay={1.1}>Dart</Chip>

      <div className="absolute inset-0 flex items-end justify-center pb-[4%]">
        <div className={cx("relative h-[90%] rounded-[8cqw] p-[1.2cqw] shadow-device", BEZEL)} style={{ aspectRatio: "9 / 19" }}>
          <div className="absolute start-1/2 top-[2.4%] z-10 h-[2.2%] w-[30%] -translate-x-1/2 rounded-full bg-[#1C1C1F] rtl:translate-x-1/2" />

          <div className="relative flex h-full flex-col overflow-hidden rounded-[6.8cqw] bg-surface text-ink">
            {/* Status bar */}
            <div className="flex items-center justify-between px-[9%] pt-[7%] text-[clamp(6px,1.6cqw,9px)] font-medium tabular-nums text-ink-soft">
              <span>9:41</span>
              <span className="flex items-end gap-[2px]">
                <span className="h-[3px] w-[2px] rounded-sm bg-ink-soft" />
                <span className="h-[5px] w-[2px] rounded-sm bg-ink-soft" />
                <span className="h-[7px] w-[2px] rounded-sm bg-ink-soft" />
              </span>
            </div>

            {/* App bar */}
            <div className="mx-[9%] mt-[8%] border-b border-line pb-[5%] text-[clamp(7px,1.9cqw,11px)] font-medium tracking-wide text-ink-soft">
              hello_world
            </div>

            {/* Body */}
            <div className="grid flex-1 place-content-center justify-items-center gap-[1.6cqw] px-[6%] pb-[14%]">
              <p className="script whitespace-nowrap text-[4.6cqw] text-ink">
                <Typed text="Hello, world!" reduced={reduced} />
              </p>
              <motion.span
                initial={{ scaleX: reduced ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: reduced ? 0 : 1.5, ease: EASE }}
                className="h-px w-[40%] origin-left bg-wine/70"
              />
            </div>

            {/* Floating action button, as in Flutter's starter app */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : 0.6, ease: EASE }}
              className="absolute bottom-[5%] end-[9%] grid aspect-square w-[22%] place-items-center rounded-[30%] bg-wine text-[3.4cqw] font-light leading-none text-white shadow-md"
            >
              +
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

// --------------------------------------------------------------------------
// Scene 2 — laptop: a few lines of C# in a dark editor
// --------------------------------------------------------------------------

const KEY = "text-[#D6808E]";
const STR = "text-[#EBC7CD]";
const TYPE = "text-white/85";
const PUNC = "text-white/50";
const NOTE = "text-white/35 italic";

const CODE = [
  [[NOTE, "// Program.cs · .NET 8"]],
  [[KEY, "var "], [TYPE, "app "], [PUNC, "= "], [TYPE, "WebApplication"]],
  [[PUNC, "  ."], [TYPE, "Create"], [PUNC, "(args);"]],
  [[TYPE, "app"], [PUNC, "."], [TYPE, "MapGet"], [PUNC, "("], [STR, '"/"'], [PUNC, ", () =>"]],
  [[STR, '  "Hello, world!"'], [PUNC, ");"]],
  [[TYPE, "app"], [PUNC, "."], [TYPE, "Run"], [PUNC, "();"]],
];

function SoftwareScene({ reduced }) {
  return (
    <>
      <Chip className="start-[8%] top-[6%]" delay={1.2}>C#</Chip>
      <Chip className="end-[10%] top-[3%]" delay={1.4}>.NET</Chip>
      <Chip className="end-[2%] top-[38%]" delay={1.6}>Flutter</Chip>

      <div className="absolute inset-0 flex items-end justify-center pb-[4%]">
        <div className="w-[86%]">
          <div className={cx("mx-auto w-[86%] rounded-t-[10px] p-[1.4%] pb-0 shadow-device", BEZEL)}>
            <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-t-[4px] bg-[#141416] font-mono">
              {/* Window bar with file tabs */}
              <div className="flex items-center gap-[1.4cqw] border-b border-white/10 bg-[#1A1A1D] px-[2.4cqw] text-[clamp(6px,1.7cqw,10px)]">
                <span className="h-[1.1cqw] w-[1.1cqw] rounded-full bg-white/20" />
                <span className="h-[1.1cqw] w-[1.1cqw] rounded-full bg-white/20" />
                <span className="h-[1.1cqw] w-[1.1cqw] rounded-full bg-wine" />
                <span className="ms-[1.6cqw] border-b border-wine py-[1.2cqw] text-white/80">Program.cs</span>
                <span className="py-[1.2cqw] text-white/35">main.dart</span>
              </div>

              {/* Code */}
              <div className="flex flex-1 gap-[2.4cqw] px-[2.4cqw] py-[2cqw] text-[clamp(7px,2.9cqw,14px)] leading-[1.65]">
                <div className="select-none text-end text-white/20">
                  {CODE.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="min-w-0 whitespace-pre">
                  {CODE.map((tokens, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: reduced ? 0 : 0.35 + i * 0.32, ease: EASE }}
                    >
                      {tokens.map(([tone, text], j) => (
                        <span key={j} className={tone}>
                          {text}
                        </span>
                      ))}
                      {i === CODE.length - 1 && (
                        <span className="showcase-caret ms-[0.1em] inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-white/60" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[1.9cqw] rounded-b-xl bg-gradient-to-b from-[#C9CACD] to-[#A7A9AD] shadow-device dark:from-[#4A4A4F] dark:to-[#2E2E32]">
            <div className="absolute inset-x-[42%] top-0 h-[40%] rounded-b-md bg-black/15" />
          </div>
        </div>
      </div>
    </>
  );
}

// --------------------------------------------------------------------------
// Scene 3 — one browser window: a local dev server opens, then the window
// narrows and the page reflows (responsive web, without extra devices)
// --------------------------------------------------------------------------

const Bar = ({ className }) => <div className={cx("rounded-full bg-line", className)} />;

function WebScene({ reduced }) {
  return (
    <>
      <Chip className="start-[6%] top-[10%]" delay={2.8}>Responsive</Chip>
      <Chip className="end-[6%] top-[18%]" delay={3}>REST APIs</Chip>

      <div className="absolute inset-0 flex items-end justify-center pb-[4%]">
        <motion.div
          initial={{ width: "74%" }}
          animate={{ width: reduced ? "74%" : "52%" }}
          transition={{ duration: 1.1, delay: 2.6, ease: EASE }}
          className="flex h-[66%] flex-col overflow-hidden rounded-[1.6cqw] border border-line bg-surface shadow-device"
        >
          {/* Address bar */}
          <div className="flex items-center gap-[1cqw] border-b border-line bg-sunken px-[2.2cqw] py-[1.4cqw]">
            <span className="h-[1.1cqw] w-[1.1cqw] shrink-0 rounded-full bg-line" />
            <span className="h-[1.1cqw] w-[1.1cqw] shrink-0 rounded-full bg-line" />
            <span className="h-[1.1cqw] w-[1.1cqw] shrink-0 rounded-full bg-wine/70" />
            <span className="ms-[1.4cqw] min-w-0 flex-1 truncate rounded-full bg-surface px-[1.6cqw] py-[0.5cqw] font-mono text-[clamp(7px,1.8cqw,11px)] text-ink-soft ring-1 ring-line">
              <Typed text="localhost:5173" reduced={reduced} delay={0.3} step={0.05} />
            </span>
          </div>

          {/* Page */}
          <motion.div
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 1.3, ease: EASE }}
            className="flex min-h-0 flex-1 flex-col gap-[2cqw] p-[3.2cqw]"
          >
            <div className="flex items-center justify-between">
              <span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-wine" />
              <div className="flex w-[30%] gap-[1.2cqw]">
                <Bar className="h-[0.5cqw] flex-1" />
                <Bar className="h-[0.5cqw] flex-1" />
                <Bar className="h-[0.5cqw] flex-1" />
              </div>
            </div>
            <div className="grid gap-[1cqw]">
              <p className="whitespace-nowrap text-[4.2cqw] font-normal leading-none text-ink">Hello, web.</p>
              <Bar className="h-[0.6cqw] w-3/5" />
              <Bar className="h-[0.6cqw] w-2/5" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(17cqw,1fr))] gap-[1.4cqw]">
              {[0, 1, 2].map((i) => (
                <motion.div layout key={i} transition={{ duration: 0.6, ease: EASE }} className="aspect-[4/3] rounded bg-sunken" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

const SCENE_VIEWS = { mobile: MobileScene, software: SoftwareScene, web: WebScene };

const Scene = memo(function Scene({ id, reduced }) {
  const View = SCENE_VIEWS[id];
  return <View reduced={reduced} />;
});

// --------------------------------------------------------------------------
// Showcase
// --------------------------------------------------------------------------

export default function DeviceShowcase() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const index = useSceneClock(rootRef, reduced ? REDUCED_SCENE_MS : SCENE_MS);
  const active = SCENES[index];

  return (
    <figure ref={rootRef}>
      {/* One static sentence for screen readers instead of a changing visual */}
      <figcaption className="sr-only">{t("showcase.summary")}</figcaption>

      {/* Stage: burgundy baseline, plus a grey disc behind the devices */}
      <div
        aria-hidden
        dir="ltr"
        lang="en"
        className="relative mx-auto aspect-[4/3] w-full max-w-[34rem] [container-type:inline-size]"
      >
        {/* The disc frames the phone and laptop; the browser scene stands on the baseline alone */}
        <motion.div
          animate={{ opacity: active === "web" ? 0 : 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="absolute inset-x-[10%] bottom-[4%] top-[2%] rounded-full bg-surface/80 dark:bg-surface/60"
        />
        <div className="absolute inset-x-[6%] bottom-[4%] h-px bg-wine/60" />

        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 1.01 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0"
          >
            <Scene id={active} reduced={reduced} />
          </motion.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}
