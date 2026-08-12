// Resend integration foundation (bootstrap phase).
//
// Intentionally minimal: just a typed factory that returns a Resend client
// when the API key is present. No email flows (welcome, consent, notifications)
// are implemented here yet. They will be added in their respective phases.

import { Resend } from "resend";

let cached: Resend | null = null;

// Lazily create a single Resend client. Throws if RESEND_API_KEY is missing,
// so callers fail fast during development rather than sending silently.
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Configure it in your environment before sending email.",
    );
  }
  if (!cached) {
    cached = new Resend(apiKey);
  }
  return cached;
}

export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
