"use server";

// OnKayit Server Action (Phase 4).
//
// This is the thin request boundary. It validates ONLY the request surface
// (the route slug + a FormData payload) and delegates all domain logic to
// `submitOnKayit` in submit.ts. Keeping the boundary thin means the action can
// evolve (auth guard, rate limit) without touching business logic.
//
// The `slug` is supplied by the page (the route param) — it is the authoritative
// school identifier, NOT a hidden client-supplied okulId. The school is resolved
// by slug server-side, so a tampered slug simply resolves to a different/empty
// school rather than impersonating another.

import { submitOnKayit, type SubmitOnKayitResult, type SubmitOnKayitInput } from "./submit";

export async function onKayitOlustur(
  slug: string,
  formData: FormData,
): Promise<SubmitOnKayitResult> {
  if (typeof slug !== "string" || slug.length === 0) {
    return { ok: false, error: "Geçersiz istek." };
  }

  const input: SubmitOnKayitInput = {};
  for (const [key, value] of formData.entries()) {
    // FormData values are string or File; we only accept plain strings.
    input[key] = typeof value === "string" ? value : undefined;
  }

  return submitOnKayit(slug, input);
}
