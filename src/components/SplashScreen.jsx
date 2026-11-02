// src/components/SplashScreen.jsx
// Opening animation: a laptop lid lifts, the screen lights up and the name is typed.
// Shown once per browser session, never with reduced motion. A click or key press skips it.
import React, { useEffect } from "react";
import { motion } from "framer-motion";

import { t } from "../content/text";
import { SPLASH_STORAGE_KEY } from "./splash";
import TypedLines from "./TypedLines";
import { EASE } from "./utils";

const SPLASH_MS = 3500;
// Starts slowly and settles, like a hand lifting a lid; the usual ease would snap it open
const LID_EASE = [0.45, 0, 0.2, 1];

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
    } catch {
      // Private mode — the splash simply shows again next time
    }

    const timer = setTimeout(onDone, SPLASH_MS);
    window.addEventListener("keydown", onDone);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onDone);
    };
  }, [onDone]);

  return (
    <motion.div
      aria-hidden
      onClick={onDone}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-0 z-[300] grid place-items-center bg-canvas px-6"
    >
      <div className="w-full max-w-[30rem] [perspective:1100px]">
        {/* Lid: hinged on its bottom edge; bezel and screen stay dark in both themes */}
        <motion.div
          initial={{ rotateX: -86 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: LID_EASE }}
          className="mx-auto w-[86%] origin-bottom rounded-t-[12px] bg-[#1C1C1F] p-[1.4%] pb-0 shadow-device ring-1 ring-black/5 dark:ring-white/10"
        >
          <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-t-[5px] bg-[#141416]">
            {/* The screen lights up as the lid opens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(158,47,64,0.28),transparent_70%)]"
            />
            <div className="relative grid justify-items-center gap-3 px-4 text-center">
              <p className="whitespace-nowrap text-[clamp(1rem,4.6vw,1.625rem)] font-light leading-none text-white">
                <TypedLines lines={[[["", t("meta.site")]]]} delay={1600} speed={48} keepCaret caretClass="ml-[0.08em] bg-white/70" />
              </p>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 2.4, ease: EASE }}
                className="h-px w-16 origin-left bg-[#D6808E]"
              />
            </div>
          </div>
        </motion.div>

        {/* Base */}
        <div className="relative h-3 rounded-b-xl bg-gradient-to-b from-[#C9CACD] to-[#A7A9AD] shadow-device dark:from-[#4A4A4F] dark:to-[#2E2E32] sm:h-4">
          <div className="absolute inset-x-[42%] top-0 h-[40%] rounded-b-md bg-black/15" />
        </div>
      </div>
    </motion.div>
  );
}
