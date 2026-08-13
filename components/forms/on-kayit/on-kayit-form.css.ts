import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const card = style({
  width: "100%",
  maxWidth: "40rem",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  padding: vars.space.xl,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
});

export const steps = style({
  display: "flex",
  gap: vars.space.sm,
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const stepItem = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  fontSize: vars.font.sizeSm,
  color: vars.color.mutedForeground,
});

export const stepBar = style({
  height: "4px",
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.border,
});

export const stepBarActive = style({
  backgroundColor: vars.color.primary,
});

export const stepLabel = style({});

export const stepLabelActive = style({
  color: vars.color.foreground,
  fontWeight: vars.font.weightMedium,
});

export const stepHeading = style({
  fontSize: vars.font.sizeLg,
  fontWeight: vars.font.weightMedium,
  color: vars.color.foreground,
});

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
});

export const label = style({
  fontSize: vars.font.sizeSm,
  fontWeight: vars.font.weightMedium,
  color: vars.color.foreground,
});

export const requiredMark = style({
  color: vars.color.danger,
});

export const input = style({
  fontFamily: vars.font.sans,
  fontSize: vars.font.sizeMd,
  color: vars.color.foreground,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  width: "100%",
  ":focus-visible": {
    outline: `2px solid ${vars.color.primary}`,
    outlineOffset: "1px",
  },
});

export const inputInvalid = style({
  borderColor: vars.color.danger,
});

export const fieldError = style({
  color: vars.color.danger,
  fontSize: vars.font.sizeSm,
});

export const legalBox = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.muted,
  padding: vars.space.md,
  fontSize: vars.font.sizeSm,
  color: vars.color.mutedForeground,
  maxHeight: "14rem",
  overflowY: "auto",
});

export const checkboxRow = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.sm,
  fontSize: vars.font.sizeMd,
  color: vars.color.foreground,
  cursor: "pointer",
});

export const checkbox = style({
  width: "1.1rem",
  height: "1.1rem",
  marginTop: "0.15rem",
  accentColor: vars.color.primary,
  flexShrink: 0,
});

export const checkboxError = style({
  color: vars.color.danger,
  fontSize: vars.font.sizeSm,
});

export const controls = style({
  display: "flex",
  justifyContent: "space-between",
  gap: vars.space.md,
});

export const button = style({
  fontFamily: vars.font.sans,
  fontSize: vars.font.sizeMd,
  fontWeight: vars.font.weightMedium,
  color: vars.color.primaryForeground,
  backgroundColor: vars.color.primary,
  border: `1px solid ${vars.color.primary}`,
  borderRadius: vars.radius.sm,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  cursor: "pointer",
  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const buttonSecondary = style({
  fontFamily: vars.font.sans,
  fontSize: vars.font.sizeMd,
  fontWeight: vars.font.weightMedium,
  color: vars.color.foreground,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  cursor: "pointer",
  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const formError = style({
  color: vars.color.danger,
  fontSize: vars.font.sizeSm,
});

export const success = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  alignItems: "center",
  textAlign: "center",
  padding: vars.space.xl,
});

export const successTitle = style({
  fontSize: vars.font.sizeXl,
  fontWeight: vars.font.weightBold,
  color: vars.color.success,
});

export const successText = style({
  fontSize: vars.font.sizeMd,
  color: vars.color.foreground,
  maxWidth: "32rem",
});

// Prevent the number inputs from showing spinners inconsistently.
globalStyle(`${input}[type="tel"], ${input}[inputmode="numeric"]`, {
  letterSpacing: "0.05em",
});
