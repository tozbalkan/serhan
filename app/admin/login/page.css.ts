import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const page = style({
  minHeight: "100dvh",
  display: "grid",
  placeItems: "center",
  padding: vars.space.xl,
  background: vars.color.muted,
});

export const card = style({
  width: "100%",
  maxWidth: "28rem",
  background: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.xl,
  boxShadow: vars.shadow.md,
});

export const title = style({
  fontSize: vars.font.size2xl,
  fontWeight: vars.font.weightBold,
  marginBottom: vars.space.md,
});

export const helper = style({
  color: vars.color.mutedForeground,
  marginBottom: vars.space.lg,
  lineHeight: vars.font.lineNormal,
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const label = style({
  fontWeight: vars.font.weightMedium,
});

export const input = style({
  width: "100%",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.font.sizeMd,
  fontFamily: vars.font.sans,
});

export const actions = style({
  marginTop: vars.space.sm,
});

export const button = style({
  border: "none",
  borderRadius: vars.radius.md,
  background: vars.color.primary,
  color: vars.color.primaryForeground,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontWeight: vars.font.weightMedium,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
});
