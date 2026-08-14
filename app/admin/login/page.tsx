import { loginAdmin } from "@/lib/auth";
import { page, card, title, form, label, input, actions, button, helper } from "./page.css";

export default function AdminLoginPage() {
  return (
    <main className={page}>
      <div className={card}>
        <h1 className={title}>Admin Girişi</h1>
        <p className={helper}>Bu aşamada temel admin erişimi için tek kullanıcı girişi kullanılır.</p>

        <form action={loginAdmin} className={form}>
          <label className={label} htmlFor="email">
            E-posta
          </label>
          <input id="email" name="email" type="email" className={input} required />

          <label className={label} htmlFor="password">
            Şifre
          </label>
          <input id="password" name="password" type="password" className={input} required />

          <div className={actions}>
            <button type="submit" className={button}>Giriş yap</button>
          </div>
        </form>
      </div>
    </main>
  );
}
