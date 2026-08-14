// Admin edit service

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateService, setServiceActive, getServiceForAdmin, deleteService } from "@/lib/admin/services";
import * as s from "@/components/cms/admin-cms.css";

export default function EditHizmetPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    content: "",
    imageUrl: "",
  });
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      try {
        const service = await getServiceForAdmin(id);
        if (!service) {
          setError("Hizmet bulunamadı");
          return;
        }

        setFormData({
          name: service.name,
          shortDescription: service.shortDescription || "",
          content: service.content,
          imageUrl: service.imageUrl || "",
        });
        setActive(service.active);
      } catch {
        setError("Hizmet yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await updateService({
        id,
        name: formData.name,
        shortDescription: formData.shortDescription || undefined,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
      });

      router.push("/admin/icerik/hizmetler");
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
      await setServiceActive({ id, active: !active });
      setActive(!active);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;

    setError("");
    setIsSubmitting(true);

    try {
      await deleteService(id);
      router.push("/admin/icerik/hizmetler");
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
        <h1>Hizmeti Düzenle</h1>
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
