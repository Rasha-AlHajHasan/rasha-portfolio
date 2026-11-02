// Colors are CSS variables (src/index.css) so light/dark themes swap in one place
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: token("surface"),
        sunken: token("sunken"),
        line: token("line"),
        ink: {
          DEFAULT: token("ink"),
          soft: token("ink-soft"),
          faint: token("ink-faint"),
        },
        // Burgundy: graphics, rules, indicators and small labels only — never body text
        wine: {
          DEFAULT: token("wine"),
          text: token("wine-text"),
          tint: token("wine-tint"),
        },
      },
      fontFamily: {
        sans: ['"Jost"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        script: ['"Allura"', "cursive"],
      },
      fontSize: {
        // Fluid sizes: modest on phones, capped on desktop
        hero: ["clamp(2rem, 1.45rem + 2.4vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        title: ["clamp(1.75rem, 1.35rem + 1.8vw, 2.625rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        heading: ["clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)", { lineHeight: "1.3" }],
        lead: ["clamp(1rem, 0.95rem + 0.25vw, 1.125rem)", { lineHeight: "1.75" }],
      },
      maxWidth: {
        page: "72rem",
      },
      boxShadow: {
        device: "0 1px 2px rgb(0 0 0 / 0.06), 0 24px 48px -24px rgb(0 0 0 / 0.35)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
