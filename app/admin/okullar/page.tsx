import { listSchools } from "@/lib/schools";
import { SchoolTable } from "@/components/admin/school-table";
import { SchoolCreateForm } from "@/components/admin/school-create-form";
import { page, heading, layout, sectionTitle } from "./page.css";

// Data-driven admin page: render at request time (the school list is read
// live from PostgreSQL), not statically prerendered at build time.
export const dynamic = "force-dynamic";

// Admin — Schools management (Phase 3).
// Server Component: fetches schools server-side. Interactive controls inside the
// table and the creation form are Client Components; this page is NOT a Client
// Component.
export default async function AdminSchoolsPage() {
  const schools = await listSchools();

  return (
    <main className={page}>
      <h1 className={heading}>Okullar</h1>

      <section className={layout}>
        <div>
          <h2 className={sectionTitle}>Okul listesi</h2>
          <SchoolTable schools={schools} />
        </div>

        <aside>
          <h2 className={sectionTitle}>Yeni okul</h2>
          <SchoolCreateForm />
        </aside>
      </section>
    </main>
  );
}
