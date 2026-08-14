// Admin references list

import { requireAdminSession } from "@/lib/auth";
import Link from "next/link";
import { listReferencesForAdmin } from "@/lib/admin/references";
import * as s from "@/components/cms/admin-cms.css";

export default async function ReferanslarPage() {
  await requireAdminSession();
  const references = await listReferencesForAdmin();

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <h1>Referanslar</h1>
        <Link href="/admin/icerik/referanslar/yeni">
          <button>Yeni Referans</button>
        </Link>
      </div>

      {references.length === 0 ? (
        <p>Henüz referans eklenmemiştir.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr className={s.rowSeparator}>
              <th className={s.th}>Ad</th>
              <th className={s.th}>Durum</th>
              <th className={s.th}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {references.map((ref) => (
              <tr key={ref.id} className={s.rowSeparator}>
                <td className={s.td}>{ref.name}</td>
                <td className={s.td}>{ref.active ? "Aktif" : "Pasif"}</td>
                <td className={s.td}>
                  <Link href={`/admin/icerik/referanslar/${ref.id}`}>
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
