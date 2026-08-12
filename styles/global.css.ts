// Global styles.
//
// RULES: keep this file limited to reset, base HTML element styles, and the
// wiring of the design tokens. NEVER put component-specific styling here.
// Component-specific styling belongs in its own *.css.ts file.

import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

// --- Reset (minimal, modern) ---
globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

globalStyle("html", {
  WebkitTextSizeAdjust: "100%",
  textSizeAdjust: "100%",
  lineHeight: vars.font.lineNormal,
});

globalStyle("body", {
  minHeight: "100dvh",
  fontFamily: vars.font.sans,
  fontSize: vars.font.sizeMd,
  lineHeight: vars.font.lineNormal,
  color: vars.color.foreground,
  backgroundColor: vars.color.background,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
});

// --- Base element styles ---
globalStyle("h1, h2, h3, h4, h5, h6", {
  fontWeight: vars.font.weightBold,
  lineHeight: vars.font.lineTight,
});

globalStyle("a", {
  color: "inherit",
});

globalStyle("img, svg, video", {
  display: "block",
  maxWidth: "100%",
  height: "auto",
});

// Focus states must never be removed (accessibility rule).
globalStyle(":focus-visible", {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: "2px",
});

// Respect reduced-motion preferences.
globalStyle("*, *::before, *::after", {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      transition: "none",
    },
  },
});
