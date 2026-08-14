// Admin FAQ list

import { requireAdminSession } from "@/lib/auth";
import Link from "next/link";
import { listFaqsForAdmin } from "@/lib/admin/faqs";
import * as s from "@/components/cms/admin-cms.css";

export default async function SssPage() {
  await requireAdminSession();
  const faqs = await listFaqsForAdmin();

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <h1>SSS (Sıkça Sorulan Sorular)</h1>
        <Link href="/admin/icerik/sss/yeni">
          <button>Yeni Soru</button>
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p>Henüz soru eklenmemiştir.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr className={s.rowSeparator}>
              <th className={s.th}>Soru</th>
              <th className={s.th}>Durum</th>
              <th className={s.th}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id} className={s.rowSeparator}>
                <td className={s.td}>{faq.question}</td>
                <td className={s.td}>{faq.active ? "Aktif" : "Pasif"}</td>
                <td className={s.td}>
                  <Link href={`/admin/icerik/sss/${faq.id}`}>
                    <button>Düzenle</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
