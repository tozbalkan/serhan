import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { changeRequestStatus, getRequestDetail } from "@/lib/admin/requests";
import * as styles from "./page.css";

const TYPE_LABELS = {
  "on-kayit": "Ön Kayıt",
  teklif: "Teklif",
  "is-basvurusu": "İş Başvurusu",
  iletisim: "İletişim",
  "arac-geri-bildirim": "Araç Geri Bildirim",
} as const;

const STATUS_OPTIONS = [
  "YENI",
  "INCELENIYOR",
  "ILETISIME_GECILDI",
  "TAMAMLANDI",
] as const;

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  await requireAdminSession();
  const { type, id } = await params;

  const map: Record<string, "ON_KAYIT" | "TEKLIF" | "IS_BASVURUSU" | "ILETISIM" | "ARAC_GERI_BILDIRIM"> = {
    "on-kayit": "ON_KAYIT",
    teklif: "TEKLIF",
    "is-basvurusu": "IS_BASVURUSU",
    iletisim: "ILETISIM",
    "arac-geri-bildirim": "ARAC_GERI_BILDIRIM",
  };

  const requestType = map[type];
  if (!requestType) notFound();

  const detail = await getRequestDetail(requestType, id) as
    | {
        adSoyad?: string;
        telefon?: string;
        eposta?: string | null;
        mesaj?: string;
        status: "YENI" | "INCELENIYOR" | "ILETISIME_GECILDI" | "TAMAMLANDI";
        createdAt: Date;
        ogrenciAd?: string;
        ogrenciSoyad?: string;
        sinifKademe?: string;
        tcKimlikNo?: string | null;
        veliAdSoyad?: string;
        adres?: string;
        notificationSent?: boolean;
        notificationSentAt?: Date | null;
        okul?: { ad?: string; slug?: string } | null;
        musteri?: { id: string; adSoyad: string; telefon: string; eposta?: string; createdAt: Date } | null;
        ogrenci?: {
          id: string;
          ad: string;
          soyad: string;
          sinifKademe: string;
          okul: { ad: string };
        } | null;
        consent?: {
          privacyNoticeVersion: string;
          privacyAcknowledgedAt: Date;
          explicitConsent: boolean;
          explicitConsentAt: Date | null;
          marketingConsent: boolean;
          marketingConsentAt: Date | null;
          ipAddress: string;
        } | null;
      }
    | null;
  if (!detail) notFound();

  const isOnKayit = requestType === "ON_KAYIT";
  const title = isOnKayit ? `${detail.ogrenciAd} ${detail.ogrenciSoyad}` : detail.adSoyad || "Talep";

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>{TYPE_LABELS[type as keyof typeof TYPE_LABELS]}</p>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <Link className={styles.backLink} href="/admin/talepler">Geri dön</Link>
      </div>

      {isOnKayit && detail.musteri ? (
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Müşteri (CRM)</h2>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
            <dl className={styles.list}>
              <div className={styles.listRow}>
                <dt className={styles.listLabel}>Ad Soyad</dt>
                <dd className={styles.listValue}>{detail.musteri.adSoyad}</dd>
              </div>
              <div className={styles.listRow}>
                <dt className={styles.listLabel}>Telefon</dt>
                <dd className={styles.listValue}>{detail.musteri.telefon}</dd>
              </div>
              <div className={styles.listRow}>
                <dt className={styles.listLabel}>E-posta</dt>
                <dd className={styles.listValue}>{detail.musteri.eposta ?? "—"}</dd>
              </div>
            </dl>
            {detail.ogrenci ? (
              <dl className={styles.list}>
                <div className={styles.listRow}>
                  <dt className={styles.listLabel}>Öğrenci (Mevcut)</dt>
                  <dd className={styles.listValue}>{detail.ogrenci.ad} {detail.ogrenci.soyad}</dd>
                </div>
                <div className={styles.listRow}>
                  <dt className={styles.listLabel}>Okul</dt>
                  <dd className={styles.listValue}>{detail.ogrenci.okul.ad}</dd>
                </div>
                <div className={styles.listRow}>
                  <dt className={styles.listLabel}>Sınıf (Mevcut)</dt>
                  <dd className={styles.listValue}>{detail.ogrenci.sinifKademe}</dd>
                </div>
              </dl>
            ) : null}
          </div>
          <Link href={`/admin/musteriler/${detail.musteri.id}`} className={styles.backLink} style={{ marginTop: "1rem", display: "inline-block" }}>
            Müşteri detaylarını gör
          </Link>
        </section>
      ) : null}

      {isOnKayit ? (
        <section className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Öğrenci</h2>
            <dl className={styles.list}>
              <div className={styles.listRow}><dt className={styles.listLabel}>Ad</dt><dd className={styles.listValue}>{detail.ogrenciAd}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Soyad</dt><dd className={styles.listValue}>{detail.ogrenciSoyad}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Sınıf/Kademe</dt><dd className={styles.listValue}>{detail.sinifKademe}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>TC Kimlik</dt><dd className={styles.listValue}>{detail.tcKimlikNo ? `*********${String(detail.tcKimlikNo).slice(-4)}` : "—"}</dd></div>
            </dl>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Veli</h2>
            <dl className={styles.list}>
              <div className={styles.listRow}><dt className={styles.listLabel}>Veli</dt><dd className={styles.listValue}>{detail.veliAdSoyad}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Telefon</dt><dd className={styles.listValue}>{detail.telefon}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>E-posta</dt><dd className={styles.listValue}>{detail.eposta ?? "—"}</dd></div>
            </dl>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Okul ve Adres</h2>
            <dl className={styles.list}>
              <div className={styles.listRow}><dt className={styles.listLabel}>Okul</dt><dd className={styles.listValue}>{detail.okul?.ad ?? "Bilinmeyen okul"}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Slug</dt><dd className={styles.listValue}>{detail.okul?.slug ?? "—"}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Adres</dt><dd className={styles.listValue}>{detail.adres}</dd></div>
            </dl>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Talep</h2>
            <dl className={styles.list}>
              <div className={styles.listRow}><dt className={styles.listLabel}>Durum</dt><dd className={styles.listValue}>{detail.status}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Oluşturulma</dt><dd className={styles.listValue}>{new Date(detail.createdAt).toLocaleString("tr-TR")}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Bildirim gönderildi</dt><dd className={styles.listValue}>{detail.notificationSent ? "Evet" : "Hayır"}</dd></div>
              <div className={styles.listRow}><dt className={styles.listLabel}>Bildirim zamanı</dt><dd className={styles.listValue}>{detail.notificationSentAt ? new Date(detail.notificationSentAt).toLocaleString("tr-TR") : "—"}</dd></div>
            </dl>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Consent</h2>
            {detail.consent ? (
              <dl className={styles.list}>
                <div className={styles.listRow}><dt className={styles.listLabel}>Aydınlatma metni</dt><dd className={styles.listValue}>{detail.consent.privacyNoticeVersion}</dd></div>
                <div className={styles.listRow}><dt className={styles.listLabel}>Aydınlatma tarihi</dt><dd className={styles.listValue}>{new Date(detail.consent.privacyAcknowledgedAt).toLocaleString("tr-TR")}</dd></div>
                <div className={styles.listRow}><dt className={styles.listLabel}>Açık rıza verildi mi</dt><dd className={styles.listValue}>{detail.consent.explicitConsent ? "Evet" : "Hayır"}</dd></div>
                <div className={styles.listRow}><dt className={styles.listLabel}>Açık rıza tarihi</dt><dd className={styles.listValue}>{detail.consent.explicitConsentAt ? new Date(detail.consent.explicitConsentAt).toLocaleString("tr-TR") : "—"}</dd></div>
                <div className={styles.listRow}><dt className={styles.listLabel}>Pazarlama izni</dt><dd className={styles.listValue}>{detail.consent.marketingConsent ? "Evet" : "Hayır"}</dd></div>
                <div className={styles.listRow}><dt className={styles.listLabel}>Pazarlama izni tarihi</dt><dd className={styles.listValue}>{detail.consent.marketingConsentAt ? new Date(detail.consent.marketingConsentAt).toLocaleString("tr-TR") : "—"}</dd></div>
                <div className={styles.listRow}><dt className={styles.listLabel}>IP</dt><dd className={styles.listValue}>{detail.consent.ipAddress}</dd></div>
              </dl>
            ) : (
              <p>Consent kaydı bulunmuyor.</p>
            )}
          </div>
        </section>
      ) : (
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Talep ayrıntıları</h2>
          <dl className={styles.list}>
            <div className={styles.listRow}><dt className={styles.listLabel}>Ad soyad</dt><dd className={styles.listValue}>{detail.adSoyad}</dd></div>
            <div className={styles.listRow}><dt className={styles.listLabel}>Telefon</dt><dd className={styles.listValue}>{detail.telefon}</dd></div>
            <div className={styles.listRow}><dt className={styles.listLabel}>E-posta</dt><dd className={styles.listValue}>{detail.eposta}</dd></div>
            <div className={styles.listRow}><dt className={styles.listLabel}>Mesaj</dt><dd className={styles.listValue}>{detail.mesaj}</dd></div>
            <div className={styles.listRow}><dt className={styles.listLabel}>Durum</dt><dd className={styles.listValue}>{detail.status}</dd></div>
            <div className={styles.listRow}><dt className={styles.listLabel}>Oluşturulma</dt><dd className={styles.listValue}>{new Date(detail.createdAt).toLocaleString("tr-TR")}</dd></div>
          </dl>
        </section>
      )}

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Durum değiştir</h2>
        <form action={changeRequestStatus} method="POST">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="type" value={requestType} />
          <select name="status" defaultValue={detail.status} className={styles.select}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button type="submit" className={styles.button}>Güncelle</button>
        </form>
      </section>
    </main>
  );
}
