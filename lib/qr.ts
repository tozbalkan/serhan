// QR code generation foundation (bootstrap phase).
//
// Intentionally minimal: a single server-side helper that renders a data string
// to a PNG QR code buffer using the `qrcode` package. The actual school-QR
// registration and vehicle-feedback flows are implemented in a later phase.

import QRCode from "qrcode";

export type QrRenderOptions = {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
};

// Generate a QR code as a PNG buffer. Suitable for returning from a route
// handler (e.g. `new Response(buffer, { headers: { "content-type": "image/png" } })`).
export async function generateQrPng(
  data: string,
  options: QrRenderOptions = {},
): Promise<Buffer> {
  const { width = 256, margin = 2, errorCorrectionLevel = "M" } = options;
  return QRCode.toBuffer(data, {
    type: "png",
    width,
    margin,
    errorCorrectionLevel,
  });
}
