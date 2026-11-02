import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import { getAbout } from "../data/content";
import { t } from "../content/text";
import { NAV_LINKS } from "./navLinks";
import { SheetText } from "./ui";

export default function SiteFooter() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    getAbout()
      .then((about) => setBadges(about.badges))
      .catch((error) => console.error("About fetch failed (footer):", error));
  }, []);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-page gap-6 px-4 py-8 text-sm text-ink-faint sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div className="min-w-0">
          <p className="text-ink">
            {t("meta.site")}
            <span className="ms-3 text-xs tabular-nums text-ink-faint">© {new Date().getFullYear()}</span>
          </p>

          {badges.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {badges.map((badge) => (
                <li key={badge.id} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-wine" />
                  <SheetText item={badge} field="title" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav aria-label={t("nav.main")}>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {NAV_LINKS.slice(1).map((link) => (
                <li key={link.id}>
                  <NavLink to={link.path} className="inline-block py-1.5 transition-colors hover:text-ink">
                    {t(`nav.${link.id}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-ink transition-colors hover:text-wine-text"
          >
            {t("common.backToTop")}
            <ArrowUp aria-hidden className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
