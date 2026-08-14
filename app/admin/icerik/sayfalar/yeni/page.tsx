// Admin create new page

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/lib/admin/pages";
import { PageCreateInput, pageCreateSchema } from "@/lib/validation/cms";
import * as s from "@/components/cms/admin-cms.css";

export default function YeniSayfaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const input: PageCreateInput = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
      };

      pageCreateSchema.parse(input);
      await createPage(input);

      router.push("/admin/icerik/sayfalar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={s.page}>
      <h1>Yeni Sayfa</h1>

      {error && <div className={s.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={s.field}>
          <label htmlFor="title" className={s.label}>Başlık *</label>
          <input
            id="title"
            type="text"
            className={s.input}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          <label htmlFor="excerpt" className={s.label}>Özet</label>
          <textarea
            id="excerpt"
            className={`${s.textarea} ${s.textareaShort}`}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
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
