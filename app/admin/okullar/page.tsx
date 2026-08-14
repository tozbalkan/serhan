import { listSchools } from "@/lib/schools";
import { SchoolTable } from "@/components/admin/school-table";
import { SchoolCreateForm } from "@/components/admin/school-create-form";
import { requireAdminSession } from "@/lib/auth";
import { page, heading, layout, sectionTitle } from "./page.css";

export const dynamic = "force-dynamic";

export default async function AdminSchoolsPage() {
  await requireAdminSession();
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
