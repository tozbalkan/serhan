import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listRequests } from "@/lib/admin/requests";
import * as styles from "./page.css";

const TYPE_OPTIONS = [
  { value: "TUMU", label: "Tümü" },
  { value: "TEKLIF", label: "Teklif" },
  { value: "IS_BASVURUSU", label: "İş Başvurusu" },
  { value: "ILETISIM", label: "İletişim" },
  { value: "ARAC_GERI_BILDIRIM", label: "Araç Geri Bildirim" },
  { value: "ON_KAYIT", label: "Ön Kayıt" },
] as const;

const STATUS_OPTIONS = [
  { value: "TUMU", label: "Tümü" },
  { value: "YENI", label: "YENİ" },
  { value: "INCELENIYOR", label: "İnceleniyor" },
  { value: "ILETISIME_GECILDI", label: "İletişime Geçildi" },
  { value: "TAMAMLANDI", label: "Tamamlandı" },
] as const;

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();

  const resolved = (await searchParams) ?? {};
  const page = Number(resolved.page ?? 1);
  const type = typeof resolved.type === "string" ? resolved.type : "TUMU";
  const status = typeof resolved.status === "string" ? resolved.status : "TUMU";
  const search = typeof resolved.search === "string" ? resolved.search : "";

  const requestType = TYPE_OPTIONS.some((option) => option.value === type) ? type : "TUMU";
  const requestStatus = STATUS_OPTIONS.some((option) => option.value === status) ? status : "TUMU";

  const data = await listRequests({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: 20,
    type: requestType as "TUMU" | "TEKLIF" | "IS_BASVURUSU" | "ILETISIM" | "ARAC_GERI_BILDIRIM" | "ON_KAYIT",
    status: requestStatus as "TUMU" | "YENI" | "INCELENIYOR" | "ILETISIME_GECILDI" | "TAMAMLANDI",
    search,
  });

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Talepler</h1>
        <form className={styles.form} action="/admin/talepler" method="GET">
          <input
            className={styles.input}
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Ara: öğrenci, veli, telefon, e-posta"
            aria-label="Taleplerde ara"
          />

          <select className={styles.select} name="type" defaultValue={requestType} aria-label="Talep tipi filtresi">
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select className={styles.select} name="status" defaultValue={requestStatus} aria-label="Talep durumu filtresi">
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button className={styles.button} type="submit">
            Uygula
          </button>
        </form>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Tip</th>
              <th className={styles.th}>Özet</th>
              <th className={styles.th}>Durum</th>
              <th className={styles.th}>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td className={styles.td} colSpan={4}>Sonuç bulunamadı.</td>
              </tr>
            ) : (
              data.items.map((item) => {
                const detailPath = `/admin/talepler/${item.type.toLowerCase().replace(/_/g, "-")}/${item.id}`;
                return (
                  <tr key={`${item.type}-${item.id}`}>
                    <td className={styles.td}>{item.type}</td>
                    <td className={styles.td}>
                      <Link className={styles.link} href={detailPath}>
                        {item.summary}
                      </Link>
                    </td>
                    <td className={styles.td}>{item.status}</td>
                    <td className={styles.td}>
                      <span className={styles.meta}>{new Date(item.createdAt).toLocaleString("tr-TR")}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <nav className={styles.pagination} aria-label="Sayfalama">
        {data.page > 1 ? (
          <Link
            className={styles.pageLink}
            href={{ pathname: "/admin/talepler", query: { ...resolved, page: String(data.page - 1) } } as unknown as string}
          >
            Önceki
          </Link>
        ) : null}

        <span>
          Sayfa {data.page} / {data.totalPages}
        </span>

        {data.page < data.totalPages ? (
          <Link
            className={styles.pageLink}
            href={{ pathname: "/admin/talepler", query: { ...resolved, page: String(data.page + 1) } } as unknown as string}
          >
            Sonraki
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
