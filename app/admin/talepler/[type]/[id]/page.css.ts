import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const page = style({
  maxWidth: "72rem",
  margin: "0 auto",
  padding: vars.space.xl,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xl,
});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: vars.space.md,
  flexWrap: "wrap",
});

export const kicker = style({
  color: vars.color.mutedForeground,
  fontSize: vars.font.sizeSm,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
});

export const title = style({
  fontSize: vars.font.size2xl,
  fontWeight: vars.font.weightBold,
  color: vars.color.foreground,
});

export const backLink = style({
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: vars.font.weightMedium,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
  gap: vars.space.lg,
});

export const card = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.background,
  padding: vars.space.lg,
  boxShadow: vars.shadow.sm,
});

export const sectionTitle = style({
  fontSize: vars.font.sizeLg,
  fontWeight: vars.font.weightBold,
  marginBottom: vars.space.md,
});

export const list = style({
  display: "grid",
  gap: vars.space.sm,
});

export const listRow = style({
  display: "grid",
  gap: vars.space.xs,
});

export const listLabel = style({
  color: vars.color.mutedForeground,
  fontSize: vars.font.sizeSm,
});

export const listValue = style({
  margin: 0,
  color: vars.color.foreground,
});

export const select = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontFamily: vars.font.sans,
  marginRight: vars.space.md,
});

export const button = style({
  border: "none",
  borderRadius: vars.radius.md,
  background: vars.color.primary,
  color: vars.color.primaryForeground,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontWeight: vars.font.weightMedium,
  cursor: "pointer",
});
