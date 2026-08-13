// School read operations (Phase 3).
//
// Server-only module: used by Server Components for data fetching. Mutation
// (create/update/toggle) lives in the co-located `actions.ts` ("use server")
// module so that Client Components importing the actions never pull the Prisma
// client (and `pg`) into the browser bundle.
//
// Security notes:
//   - Reads are by slug/id only; no client identity is trusted.
//   - Registration count uses Prisma relation count — we do NOT load OnKayit
//     rows just to count them.

import "server-only";
import { prisma } from "@/lib/db";

export type SchoolRow = {
  id: string;
  ad: string;
  slug: string;
  aktif: boolean;
  tcKimlikIster: boolean;
  kayitSayisi: number;
  createdAt: Date;
};

// List all schools with their registration count (Prisma relation count — NOT
// a load of every OnKayit row).
export async function listSchools(): Promise<SchoolRow[]> {
  const schools = await prisma.okul.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      ad: true,
      slug: true,
      aktif: true,
      tcKimlikIster: true,
      createdAt: true,
      _count: { select: { onKayitlar: true } },
    },
  });

  return schools.map((s) => ({
    id: s.id,
    ad: s.ad,
    slug: s.slug,
    aktif: s.aktif,
    tcKimlikIster: s.tcKimlikIster,
    kayitSayisi: s._count.onKayitlar,
    createdAt: s.createdAt,
  }));
}

// Lookup a single school by slug (used by the public /on-kayit/[slug] entry).
export async function getSchoolBySlug(slug: string) {
  return prisma.okul.findUnique({
    where: { slug },
    select: { ad: true, aktif: true, tcKimlikIster: true },
  });
}
