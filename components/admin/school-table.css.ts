import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const wrapper = style({
  width: "100%",
  overflowX: "auto",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: vars.font.sizeSm,
});

// Responsive: collapse to a stacked card layout on small screens. Descendant
// selectors (thead/tbody/tr/td) must use globalStyle with the parent class.
const MOBILE = "(max-width: 768px)";

globalStyle(`${table} thead`, {
  "@media": { [MOBILE]: { display: "none" } },
});

globalStyle(`${table} tbody`, {
  "@media": { [MOBILE]: { display: "block" } },
});

globalStyle(`${table} tr`, {
  "@media": {
    [MOBILE]: {
      display: "block",
      borderBottom: `1px solid ${vars.color.border}`,
      padding: vars.space.sm,
    },
  },
});

globalStyle(`${table} td`, {
  "@media": {
    [MOBILE]: {
      display: "flex",
      justifyContent: "space-between",
      gap: vars.space.md,
      padding: `${vars.space.xs} 0`,
      border: "none",
    },
  },
});

globalStyle(`${table} td::before`, {
  "@media": {
    [MOBILE]: {
      content: "attr(data-label)",
      fontWeight: vars.font.weightMedium,
      color: vars.color.mutedForeground,
    },
  },
});

export const nameCell = style({
  fontWeight: vars.font.weightMedium,
  color: vars.color.foreground,
});

export const slug = style({
  fontFamily: vars.font.mono,
  fontSize: vars.font.sizeSm,
  color: vars.color.mutedForeground,
});

export const empty = style({
  padding: vars.space.lg,
  color: vars.color.mutedForeground,
  textAlign: "center",
});
