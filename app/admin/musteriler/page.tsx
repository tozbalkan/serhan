"use server";

import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { searchCustomers } from "@/lib/admin/crm";
import * as styles from "./page.css";

export default async function MusterilerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdminSession();
  const { q } = await searchParams;

  const customers = q ? await searchCustomers(q) : [];

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Müşteriler</h1>
          <p className={styles.note}>Ad, telefon veya e-posta ile müşteri ara.</p>
        </div>
      </div>

      <form method="GET" className={styles.searchForm}>
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Ad, telefon veya e-posta..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Ara
        </button>
      </form>

      {customers.length === 0 && q ? (
        <div className={styles.emptyState}>
          <p>Sonuç bulunamadı.</p>
        </div>
      ) : null}

      {customers.length > 0 ? (
        <div className={styles.customerList}>
          {customers.map((customer) => (
            <div key={customer.id} className={styles.customerCard}>
              <p className={styles.customerName}>{customer.adSoyad}</p>
              <p className={styles.customerMeta}>
                Telefon: {customer.telefon}
                {customer.eposta && ` · E-posta: ${customer.eposta}`}
              </p>
              <Link href={`/admin/musteriler/${customer.id}`} className={styles.customerLink}>
                Detayları gör
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}
