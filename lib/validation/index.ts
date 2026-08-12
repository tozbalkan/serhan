// Shared validation schemas (bootstrap phase).
//
// Zod schemas live here so client-side and server-side validation can share the
// SAME schema. No domain schemas (OnKayit, Consent, Teklif, ...) are defined yet
// — those arrive with their respective feature phases.
//
// This file establishes the pattern: export a schema and its inferred type so
// both Server Actions and forms can import them.

import { z } from "zod";

// Minimal example shared schema. Replace / extend per feature phase.
export const emailSchema = z.string().trim().email();

export type EmailValue = z.infer<typeof emailSchema>;
