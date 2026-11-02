import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import { t } from "./content/text";
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

// "<Page> — <Name>"
function useDocumentTitle(pathname) {
  useEffect(() => {
    const page = ROUTES.find((r) => r.path === pathname.replace(/(.)\/$/, "$1"))?.page || "notFound";
    document.title = `${t(`meta.pages.${page}`)} — ${t("meta.site")}`;
  }, [pathname]);
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
        {/* "/" in development, "/rasha-portfolio/" in the GitHub Pages build (see vite.config.js) */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <AppShell>
            <AnimatedRoutes />
          </AppShell>
        </BrowserRouter>
      </ThemeProvider>
    </MotionConfig>
  );
}
