import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { getCustomerDetail } from "@/lib/admin/crm";
import * as styles from "./page.css";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const detail = await getCustomerDetail(id);

  if (!detail) {
    notFound();
  }

  const { musteri, ogrenciler, onKayitlar, totalRequests, newRequests } = detail;

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{musteri.adSoyad}</h1>
        </div>
        <Link className={styles.backLink} href="/admin/musteriler">
          Geri dön
        </Link>
      </div>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Müşteri Bilgisi</h2>
          <dl className={styles.list}>
            <div className={styles.listRow}>
              <dt className={styles.listLabel}>Ad Soyad</dt>
              <dd className={styles.listValue}>{musteri.adSoyad}</dd>
            </div>
            <div className={styles.listRow}>
              <dt className={styles.listLabel}>Telefon</dt>
              <dd className={styles.listValue}>{musteri.telefon}</dd>
            </div>
            <div className={styles.listRow}>
              <dt className={styles.listLabel}>E-posta</dt>
              <dd className={styles.listValue}>{musteri.eposta ?? "—"}</dd>
            </div>
            <div className={styles.listRow}>
              <dt className={styles.listLabel}>Kaydolunma</dt>
              <dd className={styles.listValue}>
                {new Date(musteri.createdAt).toLocaleString("tr-TR")}
              </dd>
            </div>
          </dl>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>İstatistikler</h2>
          <dl className={styles.list}>
            <div className={styles.listRow}>
              <dt className={styles.listLabel}>Toplam Talep</dt>
              <dd className={styles.listValue}>{totalRequests}</dd>
            </div>
            <div className={styles.listRow}>
              <dt className={styles.listLabel}>Yeni Talep</dt>
              <dd className={styles.listValue}>{newRequests}</dd>
            </div>
            <div className={styles.listRow}>
              <dt className={styles.listLabel}>Kayıtlı Öğrenci</dt>
              <dd className={styles.listValue}>{ogrenciler.length}</dd>
            </div>
          </dl>
        </div>

        {ogrenciler.length > 0 ? (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Kayıtlı Öğrenciler</h2>
            <ul className={styles.list}>
              {ogrenciler.map((student) => (
                <li key={student.id}>
                  <div className={styles.listRow}>
                    <dt className={styles.listLabel}>
                      {student.ad} {student.soyad}
                    </dt>
                    <dd className={styles.listValue}>
                      {student.okul.ad} · {student.sinifKademe}
                    </dd>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {onKayitlar.length > 0 ? (
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Son Talepler ({totalRequests})</h2>
          <ul className={styles.list}>
            {onKayitlar.slice(0, 10).map((kayit) => (
              <li key={kayit.id}>
                <div className={styles.listRow}>
                  <dt className={styles.listLabel}>
                    {kayit.ogrenciAd} {kayit.ogrenciSoyad}
                  </dt>
                  <dd className={styles.listValue}>
                    {kayit.okul?.ad} · {kayit.sinifKademe} · {kayit.status}
                  </dd>
                  <dd className={styles.listValue}>
                    {new Date(kayit.createdAt).toLocaleDateString("tr-TR")}
                  </dd>
                </div>
              </li>
            ))}
          </ul>
          {totalRequests > 10 ? (
            <Link href={`/admin/talepler?musteriId=${id}`} className={styles.link}>
              Tüm talepleri gör
            </Link>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
