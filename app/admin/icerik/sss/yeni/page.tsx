// Admin create new FAQ

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFaq } from "@/lib/admin/faqs";
import { FaqCreateInput, faqCreateSchema } from "@/lib/validation/cms";
import * as s from "@/components/cms/admin-cms.css";

export default function YeniSsuPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const input: FaqCreateInput = {
        question: formData.question,
        answer: formData.answer,
      };

      faqCreateSchema.parse(input);
      await createFaq(input);

      router.push("/admin/icerik/sss");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={s.page}>
      <h1>Yeni Soru Ekle</h1>

      {error && <div className={s.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={s.field}>
          <label htmlFor="question" className={s.label}>Soru *</label>
          <input
            id="question"
            type="text"
            className={s.input}
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
          />
        </div>

        <div className={s.field}>
          <label htmlFor="answer" className={s.label}>Cevap *</label>
          <textarea
            id="answer"
            className={`${s.textarea} ${s.textareaTall}`}
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            required
          />
        </div>

        <div className={s.buttonRow}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button type="button" onClick={() => router.back()}>
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
