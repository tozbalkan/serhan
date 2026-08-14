import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listSchools } from "@/lib/schools";
import { listRequests } from "@/lib/admin/requests";
import { page, title, note, cards, card, cardTitle, cardValue, cardLink, section } from "./page.css";

export default async function AdminPage() {
  await requireAdminSession();

  const [schools, latestRequests] = await Promise.all([
    listSchools(),
    listRequests({ page: 1, limit: 5 }),
  ]);

  const totalRequests = latestRequests.total;
  const newRequests = latestRequests.items.filter((item) => item.status === "YENI").length;

  return (
    <main className={page}>
      <div>
        <h1 className={title}>Yönetim Paneli</h1>
        <p className={note}>Operasyonel görünürlük için kısa özet.</p>
      </div>

      <section className={cards} aria-label="Özet kartları">
        <article className={card}>
          <p className={cardTitle}>Toplam Ön Kayıt</p>
          <p className={cardValue}>{totalRequests}</p>
          <Link href="/admin/talepler" className={cardLink}>Talepleri gör</Link>
        </article>

        <article className={card}>
          <p className={cardTitle}>Yeni Talepler</p>
          <p className={cardValue}>{newRequests}</p>
          <Link href="/admin/talepler?status=YENI" className={cardLink}>Filtrele</Link>
        </article>

        <article className={card}>
          <p className={cardTitle}>Aktif Okullar</p>
          <p className={cardValue}>{schools.filter((school) => school.aktif).length}</p>
          <Link href="/admin/okullar" className={cardLink}>Okullar</Link>
        </article>
      </section>

      <section className={section}>
        <h2 className={title}>Son Talepler</h2>
        <ul>
          {latestRequests.items.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <Link href={`/admin/talepler/${item.type.toLowerCase().replace(/_/g, "-")}/${item.id}`} className={cardLink}>
                {item.type} · {item.summary} · {item.status}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
