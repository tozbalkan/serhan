// QR code generation foundation.
//
// Two layers:
//   1. Canonical public URL builder — single source of truth for the QR target.
//   2. Renderers — PNG (via buffer) and SVG (string) from the `qrcode` package.
//
// The QR encodes ONLY the permanent public URL `NEXT_PUBLIC_APP_URL/on-kayit/<slug>`.
// It never encodes school IDs, database info, JSON, API URLs, or tokens.
// Generated images are returned on the fly and are never stored (no QR model,
// no DB storage) — they are always regenerable from the immutable slug.

import "server-only";
import QRCode from "qrcode";

export type QrRenderOptions = {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
};

const DEFAULTS: Required<QrRenderOptions> = {
  width: 256,
  margin: 2,
  errorCorrectionLevel: "M",
};

// Build the canonical public pre-registration URL for a school slug.
// The production domain is configured via NEXT_PUBLIC_APP_URL (single source of
// truth — never hardcode the domain across the codebase).
export function buildPublicOnKayitUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "";
  return `${base}/on-kayit/${encodeURIComponent(slug)}`;
}

// Generate a QR code as a PNG. Returns a concrete ArrayBuffer (valid as a
// fetch/Response body part). Suitable for returning from a route handler, e.g.:
//   new NextResponse(new Blob([png], { type: "image/png" }), { headers })
export async function generateQrPng(
  data: string,
  options: QrRenderOptions = {},
): Promise<ArrayBuffer> {
  const { width, margin, errorCorrectionLevel } = { ...DEFAULTS, ...options };
  const buffer = await QRCode.toBuffer(data, {
    type: "png",
    width,
    margin,
    errorCorrectionLevel,
  });
  const ab = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(ab).set(buffer);
  return ab;
}

// Generate a QR code as an SVG string. Same usage pattern as the PNG variant,
// returned with content-type `image/svg+xml`.
export async function generateQrSvg(
  data: string,
  options: QrRenderOptions = {},
): Promise<string> {
  const { margin, errorCorrectionLevel } = { ...DEFAULTS, ...options };
  return QRCode.toString(data, {
    type: "svg",
    margin,
    errorCorrectionLevel,
  });
}
