import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const page = style({
  maxWidth: "64rem",
  margin: "0 auto",
  padding: vars.space.xl,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
});

export const heading = style({
  fontSize: vars.font.size2xl,
  fontWeight: vars.font.weightBold,
  color: vars.color.foreground,
});

export const layout = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
  gap: vars.space.xl,
  alignItems: "start",
  "@media": {
    "(max-width: 1024px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const sectionTitle = style({
  fontSize: vars.font.sizeLg,
  fontWeight: vars.font.weightMedium,
  color: vars.color.foreground,
  marginBottom: vars.space.md,
});
