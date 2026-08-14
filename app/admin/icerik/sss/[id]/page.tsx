// Admin edit FAQ

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateFaq, setFaqActive, getFaqForAdmin, deleteFaq } from "@/lib/admin/faqs";
import * as s from "@/components/cms/admin-cms.css";

export default function EditSsuPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaq() {
      try {
        const faq = await getFaqForAdmin(id);
        if (!faq) {
          setError("Soru bulunamadı");
          return;
        }

        setFormData({
          question: faq.question,
          answer: faq.answer,
        });
        setActive(faq.active);
      } catch {
        setError("Soru yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    loadFaq();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await updateFaq({
        id,
        question: formData.question,
        answer: formData.answer,
      });

      router.push("/admin/icerik/sss");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleActive() {
    setError("");
    setIsSubmitting(true);

    try {
      await setFaqActive({ id, active: !active });
      setActive(!active);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;

    setError("");
    setIsSubmitting(true);

    try {
      await deleteFaq(id);
      router.push("/admin/icerik/sss");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className={s.loading}>Yükleniyor...</div>;

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <h1>Soruyu Düzenle</h1>
        <div className={s.buttonGroup}>
          <button onClick={handleToggleActive} disabled={isSubmitting}>
            {active ? "Pasif Yap" : "Aktif Yap"}
          </button>
          <button onClick={handleDelete} disabled={isSubmitting} className={s.deleteButton}>
            Sil
          </button>
        </div>
      </div>

      {error && <div className={s.errorBox}>{error}</div>}

      <p className={s.statusText}>Durum: <strong>{active ? "Aktif" : "Pasif"}</strong></p>

      <form onSubmit={handleUpdate}>
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
