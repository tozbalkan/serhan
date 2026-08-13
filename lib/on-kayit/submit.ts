// OnKayit pre-registration submission logic (Phase 4).
//
// This is the server-side core of the public pre-registration flow. It is kept
// OUTSIDE the "use server" actions file so it can be unit/integration tested
// without a React Server Action wrapper. The action file (actions.ts) validates
// the request surface (slug + FormData) and then delegates to `submitOnKayit`.
//
// Behavior (per spec):
//   1. Resolve Okul by slug (never trust a client-provided okulId).
//   2. School must exist AND be aktif.
//   3. Use school.tcKimlikIster to pick the right Zod schema.
//   4. Validate TC algorithmically when required.
//   5. Store only the last 4 digits of TC (minimization) when required; drop
//      any TC value when not required.
//   6. Create OnKayit + Consent in ONE transaction.
//   7. Send notification emails OUTSIDE the transaction; on failure keep
//      notificationSent = false (no rollback).

import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getClientIp } from "@/lib/ip";
import { LEGAL_VERSIONS, REGISTRATION_LEGAL_CONFIG } from "@/lib/legal/config";
import { maskTcKimlik } from "@/lib/tc-kimlik";
import { onKayitSchema } from "@/lib/validation";
import {
  sendOnKayitAdminNotification,
  sendOnKayitParentConfirmation,
} from "@/lib/resend";

export type SubmitOnKayitInput = Record<string, string | undefined>;

export type SubmitOnKayitResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fieldErrorsFromZod(issue: { path: (string | number)[]; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of issue) {
    const key = String(i.path[0] ?? "_");
    if (!out[key]) out[key] = i.message;
  }
  return out;
}

export async function submitOnKayit(
  slug: string,
  formData: SubmitOnKayitInput,
): Promise<SubmitOnKayitResult> {
  // 1-2. Resolve the school by slug; require existence + active state.
  const okul = await prisma.okul.findUnique({
    where: { slug },
    select: { id: true, ad: true, aktif: true, tcKimlikIster: true },
  });

  if (!okul) {
    return { ok: false, error: "Okul bulunamadı." };
  }
  if (!okul.aktif) {
    return { ok: false, error: "Bu okul için ön kayıt şu anda kapalı." };
  }

  // 3. Pick the schema based on the school's TC requirement AND the
  //    server-controlled explicit-consent requirement. The explicit-consent
  //    flag comes from REGISTRATION_LEGAL_CONFIG (never from the client).
  //    FormData delivers checkbox/boolean values as strings ("true" when
  //    checked, absent when unchecked). Coerce the known boolean fields to
  //    real booleans before validation so Zod's `literal(true)` checks hold.
  const BOOLEAN_FIELDS = ["privacyAcknowledged", "explicitConsent", "marketingConsent"] as const;
  const normalized: Record<string, string | boolean | undefined> = { ...formData };
  for (const key of BOOLEAN_FIELDS) {
    const raw = formData[key];
    normalized[key] = raw === "true";
  }

  const schema = onKayitSchema(
    okul.tcKimlikIster,
    REGISTRATION_LEGAL_CONFIG.explicitConsentRequired,
  );
  const parsed = schema.safeParse(normalized);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Lütfen formu kontrol edip tekrar deneyiniz.",
      fieldErrors: fieldErrorsFromZod(
        parsed.error.issues as { path: (string | number)[]; message: string }[],
      ),
    };
  }

  const v = parsed.data;

  // 5. TC minimization: store last 4 digits only when the school requires it.
  //    When not required, the schema already dropped tcKimlikNo to undefined.
  const tcKimlikNo = okul.tcKimlikIster && v.tcKimlikNo ? v.tcKimlikNo.slice(-4) : null;

  const ip = getClientIp(await headers());
  const consentAt = new Date();

  // 6. Single transaction: OnKayit + Consent (atomic).
  const kayit = await prisma.$transaction(async (tx) => {
    const created = await tx.onKayit.create({
      data: {
        okulId: okul.id,
        ogrenciAd: v.ogrenciAd,
        ogrenciSoyad: v.ogrenciSoyad,
        sinifKademe: v.sinifKademe,
        tcKimlikNo,
        adres: v.adres,
        veliAdSoyad: v.veliAdSoyad,
        telefon: v.telefon,
        eposta: v.eposta ?? null,
        status: "YENI",
      },
    });

    await tx.consent.create({
      data: {
        onKayitId: created.id,
        privacyNoticeVersion: LEGAL_VERSIONS.privacyNotice,
        privacyAcknowledgedAt: consentAt,
        // Explicit consent is stored as given. When the flow does NOT require
        // it, the value may be false/absent and the timestamp is left null —
        // the database model is preserved without adding unnecessary legal state.
        explicitConsent: v.explicitConsent,
        explicitConsentAt:
          REGISTRATION_LEGAL_CONFIG.explicitConsentRequired && v.explicitConsent
            ? consentAt
            : null,
        marketingConsent: v.marketingConsent,
        marketingConsentAt: v.marketingConsent ? consentAt : null,
        ipAddress: ip ?? "",
      },
    });

    return created;
  });

  // 7. Email notifications OUTSIDE the transaction.
  try {
    await sendOnKayitAdminNotification({
      okulAd: okul.ad,
      ogrenciAd: v.ogrenciAd,
      ogrenciSoyad: v.ogrenciSoyad,
      sinifKademe: v.sinifKademe,
      veliAdSoyad: v.veliAdSoyad,
      telefon: v.telefon,
      eposta: v.eposta ?? null,
      adres: v.adres,
      tcKimlikMasked: tcKimlikNo ? maskTcKimlik(tcKimlikNo.padStart(11, "0")) : null,
      status: "YENI",
      createdAt: kayit.createdAt.toLocaleString("tr-TR"),
    });

    if (v.eposta) {
      await sendOnKayitParentConfirmation({
        okulAd: okul.ad,
        ogrenciAd: v.ogrenciAd,
        veliAdSoyad: v.veliAdSoyad,
        eposta: v.eposta,
      });
    }

    await prisma.onKayit.update({
      where: { id: kayit.id },
      data: { notificationSent: true, notificationSentAt: new Date() },
    });
  } catch {
    // Keep notificationSent = false. Do NOT roll back OnKayit/Consent.
    // Log server-side without any sensitive form data.
    console.error(
      `[on-kayit] notification email failed for kayit ${kayit.id} (school ${okul.id})`,
    );
  }

  return { ok: true, id: kayit.id };
}
