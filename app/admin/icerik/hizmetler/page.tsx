// Admin services list

import { requireAdminSession } from "@/lib/auth";
import Link from "next/link";
import { listServicesForAdmin } from "@/lib/admin/services";
import * as s from "@/components/cms/admin-cms.css";

export default async function HizmetlerPage() {
  await requireAdminSession();
  const services = await listServicesForAdmin();

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <h1>Hizmetler</h1>
        <Link href="/admin/icerik/hizmetler/yeni">
          <button>Yeni Hizmet</button>
        </Link>
      </div>

      {services.length === 0 ? (
        <p>Henüz hizmet eklenmemiştir.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr className={s.rowSeparator}>
              <th className={s.th}>Ad</th>
              <th className={s.th}>Slug</th>
              <th className={s.th}>Durum</th>
              <th className={s.th}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className={s.rowSeparator}>
                <td className={s.td}>{service.name}</td>
                <td className={s.td}>{service.slug}</td>
                <td className={s.td}>{service.active ? "Aktif" : "Pasif"}</td>
                <td className={s.td}>
                  <Link href={`/admin/icerik/hizmetler/${service.id}`}>
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
