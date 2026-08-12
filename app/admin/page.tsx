import { page, title, note } from "./page.css";

// Admin area placeholder (bootstrap phase).
// Route foundation only: /admin
// Authentication, dashboard, unified requests, schools and CMS arrive later.
export default function AdminPage() {
  return (
    <main className={page}>
      <h1 className={title}>Yönetim Paneli</h1>
      <p className={note}>Yönetim paneli sonraki fazda kurulacaktır.</p>
    </main>
  );
}
