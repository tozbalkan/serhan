import { page, title, note } from "./page.css";

// School-service pre-registration entry point (bootstrap phase).
// Route foundation only: /on-kayit/[slug]
// The actual registration flow (Okul lookup, OnKayit form, consent) is a later phase.
export default async function OnKayitPage(props: PageProps<"/on-kayit/[slug]">) {
  const { slug } = await props.params;
  return (
    <main className={page}>
      <h1 className={title}>Ön Kayıt</h1>
      <p className={note}>
        Okul: {slug} — kayıt akışı sonraki fazda kurulacaktır.
      </p>
    </main>
  );
}
