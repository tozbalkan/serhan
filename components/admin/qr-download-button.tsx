"use client";

// Client control: downloads PNG and SVG QR codes for a school from the QR route.
// The QR route resolves the school by id and builds the canonical public URL
// server-side, so this component only needs the school id. Accessible: it is a
// real <button> (not a div) and announces its pending state.

import { useState } from "react";
import { button, actions, errorText } from "./qr-download-button.css";

type Props = {
  schoolId: string;
};

type Format = "png" | "svg";

export function QrDownloadButton({ schoolId }: Props) {
  const [busy, setBusy] = useState<Format | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function download(format: Format) {
    setBusy(format);
    setError(null);
    try {
      const res = await fetch(`/api/admin/okullar/${schoolId}/qr?format=${format}`);
      if (!res.ok) {
        throw new Error(`İndirme başarısız (${res.status}).`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `serhan-qr-${schoolId}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className={actions}>
        <button
          type="button"
          className={button}
          onClick={() => download("png")}
          disabled={busy !== null}
        >
          {busy === "png" ? "İndiriliyor…" : "PNG indir"}
        </button>
        <button
          type="button"
          className={button}
          onClick={() => download("svg")}
          disabled={busy !== null}
        >
          {busy === "svg" ? "İndiriliyor…" : "SVG indir"}
        </button>
      </div>
      {error ? (
        <p role="alert" className={errorText}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
