import { QrDownloadButton } from "./qr-download-button";
import { SchoolActiveToggle } from "./school-active-toggle";
import type { SchoolRow } from "@/lib/schools";
import * as t from "./school-table.css";

// Server Component: renders the schools list. Reads `SchoolRow[]` (already
// shaped by lib/schools). Interactive cells (QR download, active toggle) are
// Client Components; the table itself stays server-rendered.
export function SchoolTable({ schools }: { schools: SchoolRow[] }) {
  if (schools.length === 0) {
    return (
      <p className={t.empty}>
        Henüz okul eklenmedi. Aşağıdaki formdan ilk okulu oluşturabilirsiniz.
      </p>
    );
  }

  return (
    <div className={t.wrapper}>
      <table className={t.table}>
        <thead>
          <tr>
            <th scope="col">Okul adı</th>
            <th scope="col">Slug</th>
            <th scope="col">Durum</th>
            <th scope="col">TC zorunlu</th>
            <th scope="col">Kayıt</th>
            <th scope="col">Oluşturulma</th>
            <th scope="col">QR</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((s) => (
            <tr key={s.id}>
              <td data-label="Okul adı" className={t.nameCell}>
                {s.ad}
              </td>
              <td data-label="Slug">
                <code className={t.slug}>{s.slug}</code>
              </td>
              <td data-label="Durum">
                <SchoolActiveToggle schoolId={s.id} initialActive={s.aktif} />
              </td>
              <td data-label="TC zorunlu">{s.tcKimlikIster ? "Evet" : "Hayır"}</td>
              <td data-label="Kayıt">{s.kayitSayisi}</td>
              <td data-label="Oluşturulma">
                {s.createdAt.toLocaleDateString("tr-TR")}
              </td>
              <td data-label="QR">
                <QrDownloadButton schoolId={s.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
