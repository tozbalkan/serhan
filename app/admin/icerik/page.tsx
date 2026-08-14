// Admin content management dashboard

import { requireAdminSession } from "@/lib/auth";
import Link from "next/link";

export default async function IcerikPage() {
  await requireAdminSession();

  return (
    <div>
      <h1>İçerik Yönetimi</h1>
      <p>İçerik alanlarını seçin:</p>
      <ul>
        <li>
          <Link href="/admin/icerik/sayfalar">Sayfalar</Link>
        </li>
        <li>
          <Link href="/admin/icerik/hizmetler">Hizmetler</Link>
        </li>
        <li>
          <Link href="/admin/icerik/referanslar">Referanslar</Link>
        </li>
        <li>
          <Link href="/admin/icerik/sss">SSS</Link>
        </li>
        <li>
          <Link href="/admin/icerik/blog">Blog</Link>
        </li>
      </ul>
    </div>
  );
}
