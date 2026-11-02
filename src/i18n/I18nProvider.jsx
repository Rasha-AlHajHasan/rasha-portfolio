// src/i18n/I18nProvider.jsx
// Language state for the whole site: EN (LTR) / AR (RTL).
// index.html applies the saved language before first paint; this keeps it in sync afterwards.
import React, { useCallback, useEffect, useMemo, useState } from "react";

import en from "./en";
import ar from "./ar";
import { I18nContext } from "./context";

const DICTIONARIES = { en, ar };
const STORAGE_KEY = "pref:lang";

function lookup(dictionary, key) {
  return key.split(".").reduce((node, part) => node?.[part], dictionary);
}

function initialLang() {
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Private mode — the choice simply isn't remembered
    }
  }, [lang, dir]);

  const setLang = useCallback((next) => setLangState(next === "ar" ? "ar" : "en"), []);

  const value = useMemo(() => {
    // t("projects.count", { n: 3 }) — falls back to English, then to the key itself
    const t = (key, vars) => {
      const text = lookup(DICTIONARIES[lang], key) ?? lookup(en, key) ?? key;
      if (!vars || typeof text !== "string") return text;
      return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
    };

    // Sheet content: `<field>_ar` in Arabic when filled in, otherwise the English column.
    // Returns the text plus the language it is actually written in, so fallback
    // English inside the Arabic site can be marked lang="en".
    const pick = (item, field) => {
      const arabic = item?.[`${field}_ar`];
      const hasArabic = Array.isArray(arabic) ? arabic.length > 0 : Boolean(arabic);
      if (lang === "ar" && hasArabic) return { value: arabic, lang: "ar" };
      return { value: item?.[field], lang: "en" };
    };

    return { lang, dir, setLang, t, pick };
  }, [lang, dir, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
