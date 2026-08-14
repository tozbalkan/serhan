// Admin edit blog post

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateBlogPost, publishBlogPost, getBlogPostForAdmin, deleteBlogPost } from "@/lib/admin/blog";
import * as s from "@/components/cms/admin-cms.css";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
  });
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const post = await getBlogPostForAdmin(id);
        if (!post) {
          setError("Yazı bulunamadı");
          return;
        }

        setFormData({
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImage: post.coverImage || "",
        });
        setStatus(post.status);
      } catch {
        setError("Yazı yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await updateBlogPost({
        id,
        title: formData.title,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        coverImage: formData.coverImage || undefined,
      });

      router.push("/admin/icerik/blog");
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
      await publishBlogPost({ id, status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;

    setError("");
    setIsSubmitting(true);

    try {
      await deleteBlogPost(id);
      router.push("/admin/icerik/blog");
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
        <h1>Blog Yazısını Düzenle</h1>
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

        <div className={s.field}>
          <label htmlFor="coverImage" className={s.label}>Kapak Resmi URL</label>
          <input
            id="coverImage"
            type="text"
            className={s.input}
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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
