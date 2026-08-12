import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const page = style({
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.md,
  padding: vars.space.lg,
  textAlign: "center",
});

export const title = style({
  fontSize: vars.font.size3xl,
  fontWeight: vars.font.weightBold,
  color: vars.color.foreground,
});

export const status = style({
  fontSize: vars.font.sizeMd,
  color: vars.color.mutedForeground,
});
