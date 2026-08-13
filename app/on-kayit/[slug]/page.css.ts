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

export const name = style({
  fontSize: vars.font.sizeLg,
  fontWeight: vars.font.weightMedium,
  color: vars.color.foreground,
});

export const note = style({
  fontSize: vars.font.sizeMd,
  color: vars.color.mutedForeground,
  maxWidth: "36rem",
});

export const closed = style({
  fontSize: vars.font.sizeMd,
  color: vars.color.mutedForeground,
  maxWidth: "36rem",
});

export const badge = style({
  fontSize: vars.font.sizeSm,
  fontWeight: vars.font.weightMedium,
  borderRadius: vars.radius.full,
  padding: `${vars.space.xs} ${vars.space.md}`,
  selectors: {
    '&[data-state="open"]': {
      color: vars.color.success,
      backgroundColor: "hsl(140 50% 92%)",
      border: `1px solid hsl(140 50% 70%)`,
    },
    '&[data-state="closed"]': {
      color: vars.color.danger,
      backgroundColor: "hsl(0 70% 94%)",
      border: `1px solid hsl(0 70% 80%)`,
    },
  },
});
