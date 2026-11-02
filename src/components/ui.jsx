// src/components/ui.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useI18n } from "../i18n/context";
import { cx, EASE, FLIP_RTL, isExternal } from "./utils";

// --------------------------------------------------------------------------
// Motion
// --------------------------------------------------------------------------

export function Reveal({ children, delay = 0, className, as = "div", ...props }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      {...props}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

// --------------------------------------------------------------------------
// Sheet text
// --------------------------------------------------------------------------

/**
 * Renders a sheet field in the current language (`<field>_ar` in Arabic).
 * English shown as a fallback inside the Arabic site is marked lang="en" so
 * screen readers and text direction treat it correctly.
 */
export function Localized({ item, field, as: Component = "span", className, ...props }) {
  const { lang, pick } = useI18n();
  const { value, lang: valueLang } = pick(item, field);
  if (!value) return null;

  return (
    <Component
      className={className}
      lang={valueLang !== lang ? valueLang : undefined}
      dir={valueLang !== lang ? "auto" : undefined}
      {...props}
    >
      {value}
    </Component>
  );
}

// --------------------------------------------------------------------------
// Typography
// --------------------------------------------------------------------------

// Small tracked label with a burgundy rule
export function Label({ children, className, as: Component = "p" }) {
  return (
    <Component className={cx("label flex items-center gap-3", className)}>
      <span aria-hidden className="h-px w-6 shrink-0 bg-wine" />
      {children}
    </Component>
  );
}

/**
 * The reference's section header: "01  INTRODUCTION ——————————  View all →"
 */
export function SectionRule({ index, title, action, as: Component = "h2", id, className }) {
  return (
    <div className={cx("flex items-center gap-4", className)}>
      {index && <span aria-hidden className="text-xs font-medium tabular-nums text-wine-text">{index}</span>}
      {/* The label may wrap on narrow phones; the action link never moves off-screen */}
      <Component id={id} className="label min-w-0 text-ink">
        {title}
      </Component>
      <span aria-hidden className="h-px min-w-4 flex-1 bg-line" />
      {action}
    </div>
  );
}

export function PageHeader({ label, title, script, intro, children }) {
  return (
    <header className="grid gap-5 border-b border-line pb-8 md:pb-10">
      {label && <Label>{label}</Label>}

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-title font-light text-ink"
      >
        {title}
        {script && (
          <span aria-hidden className="script ms-3 inline-block text-[1.15em] text-ink-soft">
            {script}
          </span>
        )}
      </motion.h1>

      {intro && <p className="max-w-2xl text-lead text-ink-soft">{intro}</p>}
      {children}
    </header>
  );
}

// --------------------------------------------------------------------------
// Small elements
// --------------------------------------------------------------------------

export function Tag({ children, className }) {
  return (
    <span
      dir="ltr"
      className={cx(
        "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-soft",
        className
      )}
    >
      {children}
    </span>
  );
}

const buttonVariants = {
  primary: "bg-ink text-canvas hover:bg-ink/85",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-surface",
  // On burgundy: fixed colors so it reads the same in both themes
  light: "bg-white text-[#141416] hover:bg-white/90",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white/10",
  text: "text-ink underline decoration-line decoration-1 underline-offset-[6px] hover:decoration-wine",
};

export function ButtonLink({
  to,
  href,
  variant = "primary",
  icon: Icon = ArrowRight,
  children,
  className,
  ...props
}) {
  const classes = cx(
    "group/btn inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium transition-colors duration-300",
    variant === "text" ? "min-h-0 py-1" : "rounded-full px-5",
    buttonVariants[variant],
    className
  );

  const content = (
    <>
      {children}
      {Icon && (
        <Icon
          aria-hidden
          className={cx(
            "h-4 w-4 shrink-0 transition-transform duration-300 ease-editorial group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5",
            (Icon === ArrowRight || Icon === ArrowUpRight) && FLIP_RTL
          )}
        />
      )}
    </>
  );

  if (to) {
    return (
      <NavLink to={to} className={classes} {...props}>
        {content}
      </NavLink>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={isExternal(href) ? "_blank" : undefined}
        rel={isExternal(href) ? "noreferrer" : undefined}
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

// --------------------------------------------------------------------------
// Images
// --------------------------------------------------------------------------

/**
 * <img> that never shows a broken-image icon: on error it renders `fallback`
 * (or nothing) and reports the failure through onFail.
 */
export function SafeImage({ src, alt = "", className, fallback = null, onFail, onLoad, ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const [loadedSrc, setLoadedSrc] = useState(null);

  if (!src || failedSrc === src) return fallback;

  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      onLoad={(e) => {
        setLoadedSrc(src);
        onLoad?.(e);
      }}
      onError={() => {
        setFailedSrc(src);
        onFail?.(src);
      }}
      className={cx(
        "transition-opacity duration-500",
        loadedSrc === src ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    />
  );
}

// --------------------------------------------------------------------------
// States
// --------------------------------------------------------------------------

export function LoadingBlock({ label, rows = 3, className }) {
  const { t } = useI18n();

  return (
    <div className={cx("animate-pulse py-6", className)} role="status">
      <span className="sr-only">{label || t("common.loading")}</span>
      <div className="h-4 w-1/4 rounded-full bg-line/70" />
      <div className="mt-5 grid gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-2.5 rounded-full bg-line/60" style={{ width: `${88 - i * 14}%` }} />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, children, className }) {
  return (
    <div className={cx("border-y border-line py-10 text-center", className)}>
      <p className="text-heading font-light text-ink">{title}</p>
      {children && <p className="mx-auto mt-2 max-w-md text-sm text-ink-faint">{children}</p>}
    </div>
  );
}
