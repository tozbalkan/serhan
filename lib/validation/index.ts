// Shared validation schemas.
//
// Zod schemas live here so client-side and server-side validation can share the
// SAME schema. No domain schemas (OnKayit, Consent, Teklif, ...) are defined yet
// — those arrive with their respective feature phases.
//
// This file establishes the pattern: export a schema and its inferred type so
// both Server Actions and forms can import them.

import { z } from "zod";

export const emailSchema = z.string().trim().email();

export type EmailValue = z.infer<typeof emailSchema>;

// --- School mutations (Phase 3) ---
//
// IMPORTANT: the school `slug` is generated server-side and is immutable. It is
// NEVER part of any client-submitted schema, so it cannot be overridden here.

export const schoolCreateSchema = z.object({
  ad: z.string().trim().min(1, "Okul adı gereklidir.").max(120),
  tcKimlikIster: z.boolean(),
});

export type SchoolCreateInput = z.infer<typeof schoolCreateSchema>;

// Update allows only: name, active state, TC requirement.
// `id` is validated as a non-empty string and is used only to locate the record;
// it is never trusted as authorization (auth lands in a later phase) and the
// slug is never accepted.
export const schoolUpdateSchema = z.object({
  id: z.string().min(1),
  ad: z.string().trim().min(1, "Okul adı gereklidir.").max(120),
  aktif: z.boolean(),
  tcKimlikIster: z.boolean(),
});

export type SchoolUpdateInput = z.infer<typeof schoolUpdateSchema>;

// Activate/deactivate toggles a single school by id.
export const schoolToggleSchema = z.object({
  id: z.string().min(1),
  aktif: z.boolean(),
});

export type SchoolToggleInput = z.infer<typeof schoolToggleSchema>;
