// src/components/AppShell.jsx
import React from "react";

import { useI18n } from "../i18n/context";
import TopBar from "./TopBar";
import SiteFooter from "./SiteFooter";

export default function AppShell({ children }) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("nav.skip")}
      </a>

      <TopBar />

      <main id="main" className="mx-auto w-full min-w-0 max-w-page flex-1 px-4 pb-20 pt-8 sm:px-6 md:pt-12 lg:px-8">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
