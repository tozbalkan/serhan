// Admin create new reference

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReference } from "@/lib/admin/references";
import { ReferenceCreateInput, referenceCreateSchema } from "@/lib/validation/cms";
import * as s from "@/components/cms/admin-cms.css";

export default function YeniReferansPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const input: ReferenceCreateInput = {
        name: formData.name,
        logoUrl: formData.logoUrl || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        description: formData.description || undefined,
      };

      referenceCreateSchema.parse(input);
      await createReference(input);

      router.push("/admin/icerik/referanslar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={s.page}>
      <h1>Yeni Referans</h1>

      {error && <div className={s.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={s.field}>
          <label htmlFor="name" className={s.label}>Ad *</label>
          <input
            id="name"
            type="text"
            className={s.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className={s.field}>
          <label htmlFor="logoUrl" className={s.label}>Logo URL</label>
          <input
            id="logoUrl"
            type="text"
            className={s.input}
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          />
        </div>

        <div className={s.field}>
          <label htmlFor="websiteUrl" className={s.label}>Website URL</label>
          <input
            id="websiteUrl"
            type="text"
            className={s.input}
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          />
        </div>

        <div className={s.field}>
          <label htmlFor="description" className={s.label}>Açıklama</label>
          <textarea
            id="description"
            className={`${s.textarea} ${s.textareaMid}`}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
