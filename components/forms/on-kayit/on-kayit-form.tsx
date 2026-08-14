"use client";

// Public multi-step pre-registration form (Phase 4).
//
// Three logical steps:
//   1. Öğrenci       (ogrenciAd, ogrenciSoyad, sinifKademe, [tcKimlikNo])
//   2. Veli/İletişim  (veliAdSoyad, telefon, eposta, adres)
//   3. KVKK/Consent   (privacy acknowledgment, explicit consent, marketing)
//
// Notes:
//   - Client-side validation gives immediate feedback (esp. TC format). The
//     Server Action re-validates everything with Zod — client validation is UX
//     only and is never trusted.
//   - When the school does NOT require TC (showTc=false), the TC field is not
//     rendered and is never collected.
//   - No sensitive data is written to localStorage/sessionStorage or URLs.
//   - Submit is disabled while pending; the server result drives the success state.

import { useRef, useState } from "react";
import { useActionState } from "react";
import { onKayitOlustur } from "@/lib/on-kayit/actions";
import { isValidTcKimlik } from "@/lib/tc-kimlik";
import { LEGAL_VERSIONS } from "@/lib/legal/config";
import * as s from "./on-kayit-form.css";

type Props = {
  slug: string;
  okulAd: string;
  showTc: boolean;
  explicitConsentRequired: boolean;
};

type FieldErrors = Record<string, string>;

const STEP_LABELS = ["Öğrenci", "Veli / İletişim", "KVKK / Onay"];

type FormState = { ok: boolean; error?: string; fieldErrors?: FieldErrors };

export function OnKayitForm({ slug, okulAd, showTc, explicitConsentRequired }: Props) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const res = await onKayitOlustur(slug, formData);
      return res.ok ? { ok: true } : { ok: false, error: res.error, fieldErrors: res.fieldErrors };
    },
    { ok: false },
  );

  if (state.ok) {
    return (
      <div className={s.success} role="status" aria-live="polite">
        <h2 className={s.successTitle}>Ön kayıt talebiniz alınmıştır.</h2>
        <p className={s.successText}>
          {okulAd} okulu için ön kayıt talebiniz başarıyla alınmıştır. Talebiniz
          incelendikten sonra sizinle iletişime geçilecektir.
        </p>
      </div>
    );
  }

  // Step-scoped client validation (immediate feedback only).
  function validateStep(current: number): boolean {
    const form = formRef.current;
    if (!form) return true;
    const data = new FormData(form);
    const next: FieldErrors = {};

    if (current === 0) {
      if (!String(data.get("ogrenciAd") ?? "").trim()) next.ogrenciAd = "Öğrenci adı gereklidir.";
      if (!String(data.get("ogrenciSoyad") ?? "").trim()) next.ogrenciSoyad = "Öğrenci soyadı gereklidir.";
      if (!String(data.get("sinifKademe") ?? "").trim()) next.sinifKademe = "Sınıf/kademe gereklidir.";
      if (showTc) {
        const tc = String(data.get("tcKimlikNo") ?? "").trim();
        if (!tc) next.tcKimlikNo = "TC Kimlik numarası gereklidir.";
        else if (!isValidTcKimlik(tc)) next.tcKimlikNo = "Geçersiz kimlik numarası.";
      }
    }

    if (current === 1) {
      if (!String(data.get("veliAdSoyad") ?? "").trim()) next.veliAdSoyad = "Veli ad soyad gereklidir.";
      if (!String(data.get("telefon") ?? "").trim()) next.telefon = "Telefon gereklidir.";
      const eposta = String(data.get("eposta") ?? "").trim();
      if (eposta && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) next.eposta = "Geçerli bir e-posta giriniz.";
      if (!String(data.get("adres") ?? "").trim()) next.adres = "Adres gereklidir.";
    }

    if (current === 2) {
      if (data.get("privacyAcknowledged") !== "true") next.privacyAcknowledged = "Aydınlatma metnini onaylamanız gerekir.";
      // Explicit consent is only enforced client-side when the server config
      // requires it. The server re-validates this requirement authoritatively.
      if (explicitConsentRequired && data.get("explicitConsent") !== "true") {
        next.explicitConsent = "Açık rızanız gerekir.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s2) => Math.min(s2 + 1, STEP_LABELS.length - 1));
  }
  function back() {
    setErrors({});
    setStep((s2) => Math.max(s2 - 1, 0));
  }

  const err = (key: string) => errors[key] ?? state.fieldErrors?.[key];

  return (
    <form ref={formRef} action={formAction} className={s.card} noValidate>
      <ol className={s.steps} aria-label="Kayıt adımları">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className={s.stepItem}>
            <span className={`${s.stepBar} ${i <= step ? s.stepBarActive : ""}`} aria-hidden />
            <span className={`${s.stepLabel} ${i === step ? s.stepLabelActive : ""}`}>
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <fieldset className={s.fieldset}>
          <legend className={s.stepHeading}>Öğrenci Bilgileri</legend>

          <div className={s.field}>
            <label className={s.label} htmlFor="ogrenciAd">
              Öğrenci Adı <span className={s.requiredMark}>*</span>
            </label>
            <input id="ogrenciAd" name="ogrenciAd" className={`${s.input} ${err("ogrenciAd") ? s.inputInvalid : ""}`} maxLength={80} />
            {err("ogrenciAd") ? <span className={s.fieldError}>{err("ogrenciAd")}</span> : null}
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="ogrenciSoyad">
              Öğrenci Soyadı <span className={s.requiredMark}>*</span>
            </label>
            <input id="ogrenciSoyad" name="ogrenciSoyad" className={`${s.input} ${err("ogrenciSoyad") ? s.inputInvalid : ""}`} maxLength={80} />
            {err("ogrenciSoyad") ? <span className={s.fieldError}>{err("ogrenciSoyad")}</span> : null}
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="sinifKademe">
              Sınıf / Kademe <span className={s.requiredMark}>*</span>
            </label>
            <input id="sinifKademe" name="sinifKademe" className={`${s.input} ${err("sinifKademe") ? s.inputInvalid : ""}`} maxLength={40} placeholder="Örn. 2. sınıf" />
            {err("sinifKademe") ? <span className={s.fieldError}>{err("sinifKademe")}</span> : null}
          </div>

          {showTc ? (
            <div className={s.field}>
              <label className={s.label} htmlFor="tcKimlikNo">
                TC Kimlik No <span className={s.requiredMark}>*</span>
              </label>
              <input
                id="tcKimlikNo"
                name="tcKimlikNo"
                inputMode="numeric"
                className={`${s.input} ${err("tcKimlikNo") ? s.inputInvalid : ""}`}
                maxLength={11}
                autoComplete="off"
              />
              {err("tcKimlikNo") ? (
                <span className={s.fieldError}>{err("tcKimlikNo")}</span>
              ) : (
                <span className={s.noteText}>
                  Kimlik numarası formatı kontrol edilir; tam numara saklanmaz.
                </span>
              )}
            </div>
          ) : null}
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className={s.fieldset}>
          <legend className={s.stepHeading}>Veli / İletişim</legend>

          <div className={s.field}>
            <label className={s.label} htmlFor="veliAdSoyad">
              Veli Ad Soyad <span className={s.requiredMark}>*</span>
            </label>
            <input id="veliAdSoyad" name="veliAdSoyad" className={`${s.input} ${err("veliAdSoyad") ? s.inputInvalid : ""}`} maxLength={120} />
            {err("veliAdSoyad") ? <span className={s.fieldError}>{err("veliAdSoyad")}</span> : null}
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="telefon">
              Telefon <span className={s.requiredMark}>*</span>
            </label>
            <input id="telefon" name="telefon" type="tel" className={`${s.input} ${err("telefon") ? s.inputInvalid : ""}`} maxLength={20} />
            {err("telefon") ? <span className={s.fieldError}>{err("telefon")}</span> : null}
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="eposta">
              E-posta
            </label>
            <input id="eposta" name="eposta" type="email" className={`${s.input} ${err("eposta") ? s.inputInvalid : ""}`} maxLength={160} />
            {err("eposta") ? <span className={s.fieldError}>{err("eposta")}</span> : null}
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="adres">
              Adres <span className={s.requiredMark}>*</span>
            </label>
            <textarea id="adres" name="adres" className={`${s.input} ${err("adres") ? s.inputInvalid : ""}`} rows={3} maxLength={300} />
            {err("adres") ? <span className={s.fieldError}>{err("adres")}</span> : null}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className={s.fieldset}>
          <legend className={s.stepHeading}>KVKK / Açık Rıza</legend>

          <div className={s.legalBox}>
            <p>
              <strong>KVKK Aydınlatma Metni</strong> (sürüm {LEGAL_VERSIONS.privacyNotice})
            </p>
            <p className={s.noteText}>
              Verileriniz, okul servisi ön kaydı talebinizin değerlendirilmesi amacıyla
              işlenir. Aydınlatma metninin tamamı yasal belge olarak ayrıca sunulacaktır
              (belge hazırlanma aşamasındadır).
            </p>
            <p className={s.noteText}>
              <strong>Açık Rıza Metni</strong> (sürüm {LEGAL_VERSIONS.explicitConsent}):
              Kişisel verilerinizin ön kayıt süreci kapsamında işlenmesi, yalnızca
              açık rızanızın bulunduğu durumlarda geçerlidir. Açık rıza, aydınlatma
              yükümlülüğünden ayrı bir onaydır.
            </p>
          </div>

          <label className={s.checkboxRow}>
            <input type="checkbox" name="privacyAcknowledged" value="true" className={s.checkbox} />
            <span>
              KVKK kapsamında aydınlatıldığımı ve aydınlatma metnini okuduğumu onaylıyorum.
              <span className={s.requiredMark}> *</span>
            </span>
          </label>
          {err("privacyAcknowledged") ? <span className={s.checkboxError}>{err("privacyAcknowledged")}</span> : null}

          {explicitConsentRequired ? (
            <label className={s.checkboxRow}>
              <input type="checkbox" name="explicitConsent" value="true" className={s.checkbox} />
              <span>
                Kişisel verilerimin ön kayıt süreci kapsamında işlenmesini açık rızamla kabul
                ediyorum.
                <span className={s.requiredMark}> *</span>
              </span>
            </label>
          ) : null}
          {err("explicitConsent") ? <span className={s.checkboxError}>{err("explicitConsent")}</span> : null}

          <label className={s.checkboxRow}>
            <input type="checkbox" name="marketingConsent" value="true" className={s.checkbox} defaultChecked={false} />
            <span>
              Serhan Turizm&apos;den kampanya ve bilgilendirme amaçlı iletişim almak istiyorum
              (isteğe bağlı).
            </span>
          </label>
        </fieldset>
      )}

      {state.error ? (
        <p role="alert" className={s.formError}>
          {state.error}
        </p>
      ) : null}

      <div className={s.controls}>
        {step > 0 ? (
          <button type="button" className={s.buttonSecondary} onClick={back} disabled={pending}>
            Geri
          </button>
        ) : (
          <span />
        )}

        {step < STEP_LABELS.length - 1 ? (
          <button type="button" className={s.button} onClick={next} disabled={pending}>
            İleri
          </button>
        ) : (
          <button type="submit" className={s.button} disabled={pending}>
            {pending ? "Gönderiliyor…" : "Ön Kaydı Tamamla"}
          </button>
        )}
      </div>
    </form>
  );
}
