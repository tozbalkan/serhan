"use client";

// Client control: the school creation form. Submits to the `createSchool` Server
// Action. The slug is generated server-side and is never sent from here.
// Validation here is UX-only; the Server Action re-validates with Zod.

import { useState } from "react";
import { useActionState } from "react";
import { createSchool } from "@/lib/schools/actions";
import * as s from "./school-create-form.css";

type FormState = { ok: boolean; error?: string };

export function SchoolCreateForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const res = await createSchool({
        ad: String(formData.get("ad") ?? ""),
        tcKimlikIster: formData.get("tcKimlikIster") === "on",
      });
      return res.ok ? { ok: true } : { ok: false, error: res.error };
    },
    { ok: false },
  );

  const [name, setName] = useState("");
  const [tc, setTc] = useState(false);

  if (state.ok) {
    return (
      <p className={s.success} role="status">
        Okul eklendi. Liste güncellendi.
      </p>
    );
  }

  return (
    <form action={formAction} className={s.form} aria-label="Yeni okul ekle">
      <div className={s.field}>
        <label htmlFor="ad" className={s.label}>
          Okul adı
        </label>
        <input
          id="ad"
          name="ad"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={s.input}
          placeholder="Örn. ABC Koleji"
          maxLength={120}
        />
      </div>

      <div className={s.field}>
        <label htmlFor="tcKimlikIster" className={s.checkboxLabel}>
          <input
            id="tcKimlikIster"
            name="tcKimlikIster"
            type="checkbox"
            checked={tc}
            onChange={(e) => setTc(e.target.checked)}
            className={s.checkbox}
          />
          TC Kimlik numarası zorunlu olsun
        </label>
      </div>

      {state.error ? (
        <p role="alert" className={s.error}>
          {state.error}
        </p>
      ) : null}

      <button type="submit" className={s.submit} disabled={pending || name.trim() === ""}>
        {pending ? "Ekleniyor…" : "Okul ekle"}
      </button>
    </form>
  );
}
