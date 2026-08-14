import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const page = style({
  maxWidth: "64rem",
  margin: "0 auto",
  padding: vars.space.xl,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xl,
});

export const title = style({
  fontSize: vars.font.size2xl,
  fontWeight: vars.font.weightBold,
  color: vars.color.foreground,
});

export const note = style({
  fontSize: vars.font.sizeMd,
  color: vars.color.mutedForeground,
  marginTop: vars.space.xs,
});

export const cards = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
  gap: vars.space.lg,
});

export const card = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.lg,
  background: vars.color.muted,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
});

export const cardTitle = style({
  fontSize: vars.font.sizeSm,
  color: vars.color.mutedForeground,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
});

export const cardValue = style({
  fontSize: vars.font.size3xl,
  fontWeight: vars.font.weightBold,
  color: vars.color.foreground,
  lineHeight: vars.font.lineTight,
});

export const cardLink = style({
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: vars.font.weightMedium,
  width: "fit-content",
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});
