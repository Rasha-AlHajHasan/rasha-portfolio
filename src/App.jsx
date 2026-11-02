import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import I18nProvider from "./i18n/I18nProvider";
import { useI18n } from "./i18n/context";
import ThemeProvider from "./theme/ThemeProvider";
import AppShell from "./components/AppShell";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const ROUTES = [
  { path: "/", page: "home", element: <Home /> },
  { path: "/projects", page: "projects", element: <Projects /> },
  { path: "/experience", page: "experience", element: <Experience /> },
  { path: "/about", page: "about", element: <About /> },
  { path: "/skills", page: "skills", element: <Skills /> },
  { path: "/contact", page: "contact", element: <Contact /> },
];

// "<Page> — <Name>" in the current language
function useDocumentTitle(pathname) {
  const { t, lang } = useI18n();

  useEffect(() => {
    const page = ROUTES.find((r) => r.path === pathname.replace(/(.)\/$/, "$1"))?.page || "notFound";
    document.title = `${t(`meta.pages.${page}`)} — ${t("meta.site")}`;
  }, [pathname, lang, t]);
}

function AnimatedRoutes() {
  const location = useLocation();
  useDocumentTitle(location.pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          {ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <I18nProvider>
          {/* "/" in development, "/rasha-portfolio/" in the GitHub Pages build (see vite.config.js) */}
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <AppShell>
              <AnimatedRoutes />
            </AppShell>
          </BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
