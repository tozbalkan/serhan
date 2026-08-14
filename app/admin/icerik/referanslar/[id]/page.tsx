// Admin edit reference

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateReference, setReferenceActive, getReferenceForAdmin, deleteReference } from "@/lib/admin/references";
import * as s from "@/components/cms/admin-cms.css";

export default function EditReferansPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    description: "",
  });
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReference() {
      try {
        const ref = await getReferenceForAdmin(id);
        if (!ref) {
          setError("Referans bulunamadı");
          return;
        }

        setFormData({
          name: ref.name,
          logoUrl: ref.logoUrl || "",
          websiteUrl: ref.websiteUrl || "",
          description: ref.description || "",
        });
        setActive(ref.active);
      } catch {
        setError("Referans yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    loadReference();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await updateReference({
        id,
        name: formData.name,
        logoUrl: formData.logoUrl || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        description: formData.description || undefined,
      });

      router.push("/admin/icerik/referanslar");
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
      await setReferenceActive({ id, active: !active });
      setActive(!active);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu referansı silmek istediğinize emin misiniz?")) return;

    setError("");
    setIsSubmitting(true);

    try {
      await deleteReference(id);
      router.push("/admin/icerik/referanslar");
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
        <h1>Referansı Düzenle</h1>
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
