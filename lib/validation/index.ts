// Shared validation schemas.
//
// Zod schemas live here so client-side and server-side validation can share the
// SAME rules. No domain schemas (OnKayit, Consent, Teklif, ...) were defined
// until their feature phases.
//
// This file establishes the pattern: export a schema and its inferred type so
// both Server Actions and forms can import them.

import { z } from "zod";
import { isValidTcKimlik } from "@/lib/tc-kimlik";

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

// --- OnKayit pre-registration (Phase 4) ---
//
// The schema is parameterized by the school's `tcKimlikIster` configuration:
//   - when true  → TC Kimlik is required AND must pass the algorithmic check.
//   - when false → TC Kimlik is NOT collected; any client-supplied value is
//                  dropped (never stored) via the transform below.
//
// Privacy: when TC is stored at all, only the last 4 digits are persisted
// (handled in the Server Action, not here) — the full number is minimized.
// Empty optional fields (eposta) are normalized to `undefined`.

export type OnKayitFormValues = {
  ogrenciAd: string;
  ogrenciSoyad: string;
  sinifKademe: string;
  tcKimlikNo?: string;
  veliAdSoyad: string;
  telefon: string;
  eposta?: string;
  adres: string;
  privacyAcknowledged: boolean;
  explicitConsent: boolean;
  marketingConsent: boolean;
};

export function onKayitSchema(
  tcKimlikIster: boolean,
  explicitConsentRequired: boolean,
): z.ZodType<OnKayitFormValues> {
  const base = z.object({
    ogrenciAd: z.string().trim().min(1, "Öğrenci adı gereklidir.").max(80),
    ogrenciSoyad: z.string().trim().min(1, "Öğrenci soyadı gereklidir.").max(80),
    sinifKademe: z.string().trim().min(1, "Sınıf/kademe gereklidir.").max(40),
    tcKimlikNo: z.string().trim().optional().default(""),
    veliAdSoyad: z.string().trim().min(1, "Veli ad soyad gereklidir.").max(120),
    telefon: z.string().trim().min(1, "Telefon gereklidir.").max(20),
    eposta: z
      .union([z.literal(""), z.string().trim().email("Geçerli bir e-posta giriniz.")])
      .optional()
      .transform((v) => (v === "" || v === undefined ? undefined : v)),
    adres: z.string().trim().min(1, "Adres gereklidir.").max(300),
    // Privacy acknowledgement is always required and is separate from explicit
    // consent: it reflects being informed, not generic approval.
    privacyAcknowledged: z.literal(true),
    // Explicit consent is conditional. When the processing activity legally
    // requires it (server config), it must be true; otherwise it may be false
    // or absent. Never hard-coded as universally mandatory.
    explicitConsent: explicitConsentRequired
      ? z.literal(true)
      : z.boolean().optional().default(false),
    marketingConsent: z.boolean().optional().default(false),
  });

  if (tcKimlikIster) {
    return base.extend({
      tcKimlikNo: z
        .string()
        .trim()
        .min(1, "TC Kimlik numarası gereklidir.")
        .refine(isValidTcKimlik, "Geçersiz kimlik numarası."),
    }) as z.ZodType<OnKayitFormValues>;
  }

  // Not required: drop any client-supplied TC value so it is never stored.
  return base.transform((data) => ({ ...data, tcKimlikNo: undefined })) as z.ZodType<OnKayitFormValues>;
}
