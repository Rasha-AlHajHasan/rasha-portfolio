// src/i18n/context.js
import { createContext, useContext } from "react";

export const I18nContext = createContext(null);

// { lang, dir, setLang, t, pick }
export function useI18n() {
  return useContext(I18nContext);
}
