// Admin edit page

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updatePage, publishPage, getPageForAdmin, deletePage } from "@/lib/admin/pages";
import * as s from "@/components/cms/admin-cms.css";

export default function EditSayfaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
  });
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        const page = await getPageForAdmin(id);
        if (!page) {
          setError("Sayfa bulunamadı");
          return;
        }

        setFormData({
          title: page.title,
          excerpt: page.excerpt || "",
          content: page.content,
        });
        setStatus(page.status);
      } catch {
        setError("Sayfa yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await updatePage({
        id,
        title: formData.title,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
      });

      router.push("/admin/icerik/sayfalar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublish() {
    setError("");
    setIsSubmitting(true);

    try {
      const newStatus = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      await publishPage({ id, status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu sayfayı silmek istediğinize emin misiniz?")) return;

    setError("");
    setIsSubmitting(true);

    try {
      await deletePage(id);
      router.push("/admin/icerik/sayfalar");
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
        <h1>Sayfayı Düzenle</h1>
        <div className={s.buttonGroup}>
          <button onClick={handlePublish} disabled={isSubmitting}>
            {status === "PUBLISHED" ? "Yayından Kaldır" : "Yayınla"}
          </button>
          <button onClick={handleDelete} disabled={isSubmitting} className={s.deleteButton}>
            Sil
          </button>
        </div>
      </div>

      {error && <div className={s.errorBox}>{error}</div>}

      <p className={s.statusText}>Durum: <strong>{status}</strong></p>

      <form onSubmit={handleUpdate}>
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
