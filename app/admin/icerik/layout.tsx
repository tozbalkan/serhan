// Admin content management layout

import { requireAdminSession } from "@/lib/auth";
import Link from "next/link";
import * as s from "@/components/cms/admin-cms.css";

const navItems = [
  { href: "/admin/icerik", label: "İçerik" },
  { href: "/admin/icerik/sayfalar", label: "Sayfalar" },
  { href: "/admin/icerik/hizmetler", label: "Hizmetler" },
  { href: "/admin/icerik/referanslar", label: "Referanslar" },
  { href: "/admin/icerik/sss", label: "SSS" },
  { href: "/admin/icerik/blog", label: "Blog" },
];

export default async function IcerikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className={s.layout}>
      <nav className={s.nav}>
        <ul className={s.navList}>
          {navItems.map((item) => (
            <li key={item.href} className={s.navItem}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className={s.content}>{children}</main>
    </div>
  );
}
