# Frontend Engineering Rules — Serhan Turizm

> **Permanent convention.** Any future coding agent modifying frontend code in
> this repository MUST read this file first. These rules are mandatory for all
> frontend code, including changes during later feature phases.

## Styling

- **Vanilla Extract ONLY.** All component styling uses `*.css.ts` files.
- **No Tailwind.**
- **No inline styles** (`style={{ ... }}` on elements is forbidden).
- **No CSS Modules** (`.module.css`).
- **No styled-components, Emotion, or any runtime CSS-in-JS.**
- Global CSS is limited to: reset, base HTML element styles, CSS variables /
  tokens, and truly global styles. Component-specific styling NEVER goes in
  global CSS.
- All design tokens live in `styles/tokens.css.ts` and are consumed via the
  exported `vars` object.

## Colors

- **HSL only.** Use `hsl(...)`.
- **No hex** (`#fff`), **no `rgb()`**, **no `rgba()`**.
- Never scatter raw color values in components. Always reference `vars.color.*`.

## Units & sizing

- **Prefer `rem`** for sizing.
- **`px` is allowed only where technically necessary** (e.g. a 1px border).
- Prefer `%`, `vw`, `vh`, `dvh`, `svh` where appropriate.
- Use `clamp()`, `min()`, `max()` to improve responsive behavior.
- Avoid arbitrary hardcoded dimensions.

## Typography

- Typography is **tokenized** in `vars.font.*` (sizes, weights, line-heights).
- Never specify raw font sizes inside components.

## Spacing

- Use the centralized spacing scale `vars.space.*`.
- Never scatter arbitrary spacing values throughout the application.

## Borders / radius

- Use `vars.radius.*` for border radii.
- Centralize border definitions where appropriate.

## Shadows / breakpoints / z-index

- Shadows: `vars.shadow.*`.
- Breakpoints: `vars.breakpoint.*`.
- z-index layers: `vars.zIndex.*` where appropriate.

## React

- **Server Components by default.**
- Use `"use client"` **only** when client-side interactivity is actually
  required (event handlers, browser APIs, hooks with state).
- Do **not** turn entire pages into Client Components unnecessarily.
- Keep business logic **outside** presentation components.
- Keep data fetching **server-side** where possible.
- Do **not** introduce React Context unless there is a concrete architectural
  requirement.
- Prefer simple props and composition.
- Avoid unnecessary global state.

## TypeScript

- **`strict` mode is mandatory.**
- Avoid `any`.
- Avoid unnecessary type assertions (`as`).
- Prefer explicit domain types.
- Keep server/client boundaries type-safe.

## Forms

- Use semantic HTML (`<form>`, `<label>`, `<input>`, `<button type="submit">`).
- Use **Zod** for validation.
- Client and server validation should **share the same schemas** where practical
  (see `lib/validation/`).
- Do **not** trust client-provided identifiers or authorization-sensitive
  values.
- Server Actions must validate all relevant data **server-side**.

## Accessibility

- Use semantic HTML.
- Labels must be associated with their form controls (`htmlFor`/`id` or wrapping).
- Buttons must be actual `<button>` elements.
- Links must be actual `<a>` elements.
- Keyboard navigation must work.
- **Focus states must not be removed.**
- Form validation errors must be accessible (associated with the field, announced).
- Do **not** use `<div>`s as interactive controls.

## Responsive design

- Design responsively from the beginning.
- No desktop-only layouts.
- No reliance on fixed viewport assumptions.
- Use modern responsive CSS.

## No visual design invention (bootstrap)

During bootstrap, do **not** make visual design decisions beyond the technical
design-system foundation. Do not invent brand colors, final typography, hero
designs, page layouts, marketing sections, animations, visual identity, final
navigation, or final admin UI. Those are defined in the design phase. The root
page only proves the app works.

## Code quality

- Clean imports, no dead code, no unnecessary abstractions.
- No speculative infrastructure (no premature services/repositories/factories).
- No unnecessary TODO comments.
- Intentional, explicit server/client boundaries.
- Readable naming; small, focused modules.
