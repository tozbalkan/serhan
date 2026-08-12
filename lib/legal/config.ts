// Single source of truth for legal document versions.
//
// Legal documents are versioned as files under /legal (see legal/README.md),
// NOT through a CMS. When a legal document is updated, bump the relevant key
// here and add the corresponding file (e.g. kvkk-aydinlatma-2026.08.01.md).
// Never hardcode legal versions elsewhere in the application.

export const LEGAL_VERSIONS = {
  privacyNotice: "2026.08.01",
  explicitConsent: "2026.08.01",
} as const;

export type LegalDocKey = keyof typeof LEGAL_VERSIONS;
