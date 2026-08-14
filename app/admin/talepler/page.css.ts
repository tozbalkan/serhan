import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const page = style({
  maxWidth: "80rem",
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

export const topBar = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: vars.space.md,
  flexWrap: "wrap",
});

export const form = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
  alignItems: "center",
});

export const input = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  minWidth: "12rem",
  fontFamily: vars.font.sans,
});

export const select = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontFamily: vars.font.sans,
});

export const button = style({
  border: `1px solid ${vars.color.border}`,
  background: vars.color.primary,
  color: vars.color.primaryForeground,
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontWeight: vars.font.weightMedium,
});

export const tableWrap = style({
  overflowX: "auto",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  background: vars.color.background,
});

export const th = style({
  textAlign: "left",
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
  fontSize: vars.font.sizeSm,
  color: vars.color.mutedForeground,
  background: vars.color.muted,
});

export const td = style({
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
  verticalAlign: "top",
});

export const link = style({
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: vars.font.weightMedium,
});

export const meta = style({
  color: vars.color.mutedForeground,
  fontSize: vars.font.sizeSm,
});

export const pagination = style({
  display: "flex",
  gap: vars.space.sm,
  flexWrap: "wrap",
  alignItems: "center",
});

export const pageLink = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  textDecoration: "none",
  color: vars.color.foreground,
});
