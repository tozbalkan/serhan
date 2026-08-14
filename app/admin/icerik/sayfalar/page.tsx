// Admin pages list

import { requireAdminSession } from "@/lib/auth";
import Link from "next/link";
import { listPagesForAdmin } from "@/lib/admin/pages";
import * as s from "@/components/cms/admin-cms.css";

export default async function SayfalarPage() {
  await requireAdminSession();
  const pages = await listPagesForAdmin();

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <h1>Sayfalar</h1>
        <Link href="/admin/icerik/sayfalar/yeni">
          <button>Yeni Sayfa</button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <p>Henüz sayfa eklenmemiştir.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr className={s.rowSeparator}>
              <th className={s.th}>Başlık</th>
              <th className={s.th}>Slug</th>
              <th className={s.th}>Durum</th>
              <th className={s.th}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className={s.rowSeparator}>
                <td className={s.td}>{page.title}</td>
                <td className={s.td}>{page.slug}</td>
                <td className={s.td}>{page.status}</td>
                <td className={s.td}>
                  <Link href={`/admin/icerik/sayfalar/${page.id}`}>
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
