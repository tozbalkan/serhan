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

// ---------------------------------------------------------------------------
// Registration legal configuration (Phase 4 correction).
//
// Whether the school pre-registration flow LEGALLY requires EXPLICIT consent is
// NOT a permanent business/legal decision. It is kept as a simple application
// constant so the code can render and store explicit consent WITHOUT hard-coding
// it as universally mandatory.
//
//   explicitConsentRequired = false  → explicit consent is OPTIONAL; registration
//                                       is not blocked if it is omitted.
//   explicitConsentRequired = true   → explicit consent is REQUIRED (checkbox shown,
//                                       must be checked to submit).
//
// DEFAULT IS false. This is a temporary technical default until legal counsel
// confirms whether the processing activity has a separate legal basis (e.g.
// contract / legitimate interest) or actually requires explicit consent.
//
// This is server-controlled configuration. It must NEVER be accepted from the
// client. Do not introduce a database-driven or workflow-based legal config.
// ---------------------------------------------------------------------------

export const REGISTRATION_LEGAL_CONFIG = {
  explicitConsentRequired: false,
} as const;
