import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import { getAbout, getProfile } from "../data/content";
import { useI18n } from "../i18n/context";
import { NAV_LINKS } from "./navLinks";
import { Localized } from "./ui";

export default function SiteFooter() {
  const { t } = useI18n();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    async function loadFooter() {
      const [profileResult, aboutResult] = await Promise.allSettled([getProfile(), getAbout()]);

      if (profileResult.status === "fulfilled") setProfile(profileResult.value);
      if (aboutResult.status === "fulfilled") setBadges(aboutResult.value.badges);
    }

    loadFooter();
  }, []);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-page gap-6 px-4 py-8 text-sm text-ink-faint sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div className="min-w-0">
          <p className="text-ink">
            {profile ? <Localized item={profile} field="name" /> : t("meta.site")}
            <span className="ms-3 text-xs tabular-nums text-ink-faint">© {new Date().getFullYear()}</span>
          </p>

          {badges.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {badges.map((badge) => (
                <li key={badge.id} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-wine" />
                  <Localized item={badge} field="title" />
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
