import Link from "next/link";
import { logoutAdmin } from "@/lib/auth";
import { page, nav, links, link, actions } from "./layout.css";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/talepler", label: "Talepler" },
  { href: "/admin/musteriler", label: "Müşteriler" },
  { href: "/admin/okullar", label: "Okullar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={page}>
      <header className={nav}>
        <nav aria-label="Admin navigasyonu" className={links}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={link}
              prefetch={true}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAdmin} className={actions}>
          <button type="submit">Çıkış</button>
        </form>
      </header>

      <main>{children}</main>
    </div>
  );
}
