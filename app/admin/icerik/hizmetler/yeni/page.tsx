// Admin create new service

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/lib/admin/services";
import { ServiceCreateInput, serviceCreateSchema } from "@/lib/validation/cms";
import * as s from "@/components/cms/admin-cms.css";

export default function YeniHizmetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    content: "",
    imageUrl: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const input: ServiceCreateInput = {
        name: formData.name,
        slug: formData.slug,
        shortDescription: formData.shortDescription || undefined,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
      };

      serviceCreateSchema.parse(input);
      await createService(input);

      router.push("/admin/icerik/hizmetler");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={s.page}>
      <h1>Yeni Hizmet</h1>

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
          <label htmlFor="slug" className={s.label}>Slug *</label>
          <input
            id="slug"
            type="text"
            className={s.input}
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>

        <div className={s.field}>
          <label htmlFor="shortDescription" className={s.label}>Kısa Açıklama</label>
          <textarea
            id="shortDescription"
            className={`${s.textarea} ${s.textareaShort}`}
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          />
        </div>

        <div className={s.field}>
          <label htmlFor="content" className={s.label}>İçerik *</label>
          <textarea
            id="content"
            className={`${s.textarea} ${s.textareaTall}`}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>

        <div className={s.field}>
          <label htmlFor="imageUrl" className={s.label}>Resim URL</label>
          <input
            id="imageUrl"
            type="text"
            className={s.input}
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
