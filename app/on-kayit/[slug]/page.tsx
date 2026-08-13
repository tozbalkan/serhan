import { notFound } from "next/navigation";
import { getSchoolBySlug } from "@/lib/schools";
import { page, title, name, note, closed, badge } from "./page.css";

// Public school-service pre-registration entry point (Phase 3).
//
// The route `slug` is the authoritative school identifier. We resolve the school
// by slug (never by a client-provided id or hidden field). Behaviour:
//   - school not found  → 404
//   - school inactive   → simple "closed" state, but the QR URL stays valid
//   - school active     → show name + a placeholder indicating the form is coming
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
      <p className={note}>
        Ön kayıt formu yakında bu sayfada yayınlanacaktır. TC Kimlik numarası
        {okul.tcKimlikIster ? " bu okul için zorunludur." : " bu okul için isteğe bağlıdır."}
      </p>
    </main>
  );
}
