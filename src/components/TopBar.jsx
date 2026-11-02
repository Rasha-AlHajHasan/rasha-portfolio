import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";

import { t } from "../content/text";
import { useTheme } from "../theme/context";
import { NAV_LINKS } from "./navLinks";
import { cx, EASE } from "./utils";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? t("prefs.theme.toLight") : t("prefs.theme.toDark")}
      title={dark ? t("prefs.theme.toLight") : t("prefs.theme.toDark")}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink/40"
    >
      {dark ? <Sun aria-hidden className="h-4 w-4" /> : <Moon aria-hidden className="h-4 w-4" />}
    </button>
  );
}

function DesktopLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cx(
          "relative px-1 py-2 text-sm transition-colors duration-300",
          isActive ? "text-ink" : "text-ink-faint hover:text-ink"
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <motion.span
              layoutId="nav-active"
              aria-hidden
              className="absolute inset-x-1 -bottom-px h-px bg-wine"
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function TopBar() {
  const { pathname } = useLocation();
  // The menu remembers the page it was opened on, so navigating closes it
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const setOpen = (value) => setOpenOn(value ? pathname : null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Menu on the left and theme on the right keep the phone bar balanced */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-canvas lg:hidden"
        >
          {open ? <X aria-hidden className="h-4 w-4" /> : <Menu aria-hidden className="h-4 w-4" />}
        </button>

        {/* -ms-1: the links' own padding would otherwise push them off the page's left edge */}
        <nav aria-label={t("nav.main")} className="-ms-1 hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <DesktopLink key={link.id} to={link.path} label={t(`nav.${link.id}`)} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <NavLink
            to="/contact"
            className="hidden h-9 items-center rounded-full bg-ink px-4 text-xs font-medium tracking-wide text-canvas transition-colors hover:bg-ink/85 xl:inline-flex"
          >
            {t("nav.cta")}
          </NavLink>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label={t("nav.main")}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-x-0 top-full border-b border-line bg-canvas lg:hidden"
          >
            <ul className="mx-auto grid w-full max-w-page px-4 py-3 sm:px-6">
              {NAV_LINKS.map((link, i) => (
                <li key={link.id} className="border-b border-line last:border-b-0">
                  <NavLink
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) =>
                      cx(
                        "flex min-h-12 items-center gap-4 text-base transition-colors",
                        isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span aria-hidden className="w-5 text-xs tabular-nums text-wine-text">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {t(`nav.${link.id}`)}
                        {isActive && <span aria-hidden className="ms-auto h-1.5 w-1.5 rounded-full bg-wine" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
