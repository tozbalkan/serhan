import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const toggle = style({
  fontFamily: vars.font.sans,
  fontSize: vars.font.sizeSm,
  fontWeight: vars.font.weightMedium,
  borderRadius: vars.radius.full,
  padding: `${vars.space.xs} ${vars.space.md}`,
  border: `1px solid ${vars.color.border}`,
  cursor: "pointer",
  color: vars.color.mutedForeground,
  backgroundColor: vars.color.muted,
  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  selectors: {
    "&[data-active='true']": {
      color: vars.color.success,
      backgroundColor: "hsl(140 50% 92%)",
      borderColor: "hsl(140 50% 70%)",
    },
    "&[data-active='false']": {
      color: vars.color.danger,
      backgroundColor: "hsl(0 70% 94%)",
      borderColor: "hsl(0 70% 80%)",
    },
  },
});
