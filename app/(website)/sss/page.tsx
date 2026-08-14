// Public FAQ page

import { listActiveFaqs } from "@/lib/cms";
import { Metadata } from "next";
import * as s from "@/components/cms/website-cms.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Serhan Turizm hakkında sıkça sorulan soruların cevapları",
};

export default async function SssPage() {
  const faqs = await listActiveFaqs();

  return (
    <main className={s.main}>
      <h1 className={s.headline}>Sıkça Sorulan Sorular</h1>

      {faqs.length === 0 ? (
        <p>Henüz soru ve cevap bulunmamaktadır.</p>
      ) : (
        <div className={s.listBlock}>
          {faqs.map((faq, index) => (
            <div key={faq.id} className={s.faqItem}>
              <h3>{index + 1}. {faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
