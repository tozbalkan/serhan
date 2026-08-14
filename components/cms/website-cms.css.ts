// Shared minimal styling for public CMS pages (Phase 7).
//
// Functional rendering only — no final visual identity. All values reference
// design tokens (HSL colors, rem spacing).

import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const main = style({
  display: "block",
  maxWidth: "60rem",
  marginInline: "auto",
  padding: vars.space.md,
  color: vars.color.foreground,
  fontFamily: vars.font.sans,
});

export const backLink = style({
  display: "inline-block",
  marginBottom: vars.space.md,
  color: vars.color.primary,
});

export const metaText = style({
  color: vars.color.mutedForeground,
  fontSize: vars.font.sizeSm,
  marginBottom: vars.space.md,
});

export const coverImage = style({
  display: "block",
  maxWidth: "100%",
  height: "auto",
  marginBottom: vars.space.lg,
  borderRadius: vars.radius.md,
});

export const excerpt = style({
  fontSize: vars.font.sizeLg,
  fontStyle: "italic",
  marginBottom: vars.space.md,
});

export const article = style({
  marginBottom: vars.space.lg,
  lineHeight: vars.font.lineNormal,
});

export const listBlock = style({
  marginTop: vars.space.lg,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
  gap: vars.space.lg,
  marginTop: vars.space.lg,
});

export const refCard = style({
  textAlign: "center",
});

export const refLogo = style({
  display: "block",
  maxWidth: "100%",
  height: "7.5rem",
  objectFit: "contain",
  marginInline: "auto",
  marginBottom: vars.space.md,
});

export const refLink = style({
  color: vars.color.primary,
});

export const faqItem = style({
  marginBottom: vars.space.lg,
  paddingBottom: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const blogItem = style({
  marginBottom: vars.space.lg,
  paddingBottom: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const headline = style({
  fontSize: vars.font.size2xl,
  fontWeight: vars.font.weightBold,
  marginBottom: vars.space.sm,
});
