import { notFound } from "next/navigation";
import { getSchoolBySlug } from "@/lib/schools";
import { REGISTRATION_LEGAL_CONFIG } from "@/lib/legal/config";
import { OnKayitForm } from "@/components/forms/on-kayit/on-kayit-form";
import { page, title, name, closed, badge } from "./page.css";

// Public school-service pre-registration entry point (Phase 4).
//
// The route `slug` is the authoritative school identifier. We resolve the school
// by slug (never by a client-provided id or hidden field). Behaviour:
//   - school not found  → 404
//   - school inactive   → simple "closed" state, but the QR URL stays valid
//   - school active     → show the multi-step pre-registration form
//
// Rendered dynamically: the school is looked up live from PostgreSQL per request.
export const dynamic = "force-dynamic";

export default async function OnKayitPage(
  props: PageProps<"/on-kayit/[slug]">,
) {
  const { slug } = await props.params;

  const okul = await getSchoolBySlug(slug);

  if (!okul) {
    notFound();
  }

  if (!okul.aktif) {
    return (
      <main className={page}>
        <p className={badge} data-state="closed">
          Kayıt kapalı
        </p>
        <h1 className={title}>{okul.ad}</h1>
        <p className={closed}>
          Bu okul için ön kayıt şu anda aktif değildir. QR kodu hâlâ geçerlidir;
          kayıt açıldığında bu sayfa üzerinden başvuru yapabilirsiniz.
        </p>
      </main>
    );
  }

  return (
    <main className={page}>
      <p className={badge} data-state="open">
        Kayıt açık
      </p>
      <h1 className={title}>{okul.ad}</h1>
      <p className={name}>Okul servisi ön kaydı</p>
      <OnKayitForm
        slug={slug}
        okulAd={okul.ad}
        showTc={okul.tcKimlikIster}
        explicitConsentRequired={REGISTRATION_LEGAL_CONFIG.explicitConsentRequired}
      />
    </main>
  );
}
