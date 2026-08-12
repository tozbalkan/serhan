import { title, status, page } from "./page.css";

// Public-facing root page (bootstrap phase).
// Purpose: prove the application and design-token foundation work.
// This is NOT the final corporate website.
export default function HomePage() {
  return (
    <main className={page}>
      <h1 className={title}>Serhan Turizm</h1>
      <p className={status}>Uygulama çalışıyor.</p>
    </main>
  );
}
