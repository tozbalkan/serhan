import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildPublicOnKayitUrl, generateQrPng, generateQrSvg } from "@/lib/qr";

// GET /api/admin/okullar/[id]/qr?format=png|svg
//
// Server-only QR generation. Resolves the school by `id` (never trusting a
// client-provided URL or slug for identity), derives the canonical public URL
// from the immutable slug, and returns a freshly generated QR image. The image
// is never stored (no QR model, no DB storage); it is always regenerable.
type QrRouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: QrRouteContext) {
  const { id } = await ctx.params;
  const format = req.nextUrl.searchParams.get("format") ?? "png";

  const okul = await prisma.okul.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!okul) {
    return new NextResponse("Okul bulunamadı.", { status: 404 });
  }

  const url = buildPublicOnKayitUrl(okul.slug);

  if (format === "svg") {
    const svg = await generateQrSvg(url);
    return new NextResponse(svg, {
      status: 200,
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "content-disposition": `inline; filename="serhan-qr-${id}.svg"`,
        "cache-control": "no-store",
      },
    });
  }

  const png = await generateQrPng(url);
  return new NextResponse(new Blob([png], { type: "image/png" }), {
    status: 200,
    headers: {
      "content-type": "image/png",
      "content-disposition": `inline; filename="serhan-qr-${id}.png"`,
      "cache-control": "no-store",
    },
  });
}
