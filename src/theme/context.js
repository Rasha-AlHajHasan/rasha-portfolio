// src/theme/context.js
import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

// { theme: "light" | "dark", toggleTheme }
export function useTheme() {
  return useContext(ThemeContext);
}
