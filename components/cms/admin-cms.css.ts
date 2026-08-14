// Shared minimal styling for CMS admin screens (Phase 7).
//
// These are intentionally plain: functional admin UI only, no visual design
// invention. All values reference design tokens (HSL colors, rem spacing).

import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/tokens.css";

export const page = style({
  display: "block",
  color: vars.color.foreground,
  fontFamily: vars.font.sans,
});

export const headerRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: vars.space.md,
});

export const buttonGroup = style({
  display: "flex",
  gap: vars.space.sm,
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
});

export const th = style({
  textAlign: "left",
  padding: vars.space.sm,
  borderBottom: `1px solid ${vars.color.border}`,
  fontWeight: vars.font.weightMedium,
});

export const td = style({
  padding: vars.space.sm,
});

export const rowSeparator = style({
  borderBottom: `1px solid ${vars.color.border}`,
});

export const errorBox = style({
  padding: vars.space.md,
  backgroundColor: vars.color.dangerBg,
  color: vars.color.danger,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.danger}`,
  marginBottom: vars.space.md,
});

export const statusText = style({
  marginBottom: vars.space.md,
});

export const field = style({
  marginBottom: vars.space.md,
});

export const label = style({
  display: "block",
  marginBottom: vars.space.xs,
  fontWeight: vars.font.weightMedium,
});

export const input = style({
  display: "block",
  width: "100%",
  marginTop: vars.space.xs,
  padding: vars.space.sm,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  fontFamily: vars.font.sans,
  fontSize: vars.font.sizeMd,
  color: vars.color.foreground,
  backgroundColor: vars.color.background,
});

export const textarea = style([
  input,
  {
    resize: "vertical",
  },
]);

export const textareaShort = style({
  height: "4rem",
});

export const textareaMid = style({
  height: "6rem",
});

export const textareaTall = style({
  height: "12rem",
});

export const buttonRow = style({
  display: "flex",
  gap: vars.space.md,
});

export const deleteButton = style({
  backgroundColor: vars.color.dangerBg,
  color: vars.color.danger,
  border: `1px solid ${vars.color.danger}`,
});

export const loading = style({
  padding: vars.space.md,
});

export const layout = style({
  display: "flex",
  gap: vars.space.md,
});

export const nav = style({
  width: "12.5rem",
  borderRight: `1px solid ${vars.color.border}`,
});

export const navList = style({
  listStyle: "none",
  padding: vars.space.md,
  margin: 0,
});

export const navItem = style({
  marginBottom: vars.space.sm,
});

export const content = style({
  flex: 1,
  padding: vars.space.md,
});
