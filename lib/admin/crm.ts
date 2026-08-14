// Admin CRM query layer (Phase 6)
//
// Minimal server-side query layer for customer search and detail pages.
// All queries require admin authentication (enforced at the route level).

import "server-only";
import { prisma } from "@/lib/db";
import { getCustomerHistory, getCustomerStudents } from "@/lib/crm";

export async function searchCustomers(query: string) {
  const search = query.trim().toLowerCase();

  if (!search) {
    return [];
  }

  const customers = await prisma.musteri.findMany({
    where: {
      OR: [
        { adSoyad: { contains: search, mode: "insensitive" } },
        { telefon: { contains: search, mode: "insensitive" } },
        { eposta: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50, // limit results
  });

  return customers;
}

export async function getCustomerDetail(musteriId: string) {
  const musteri = await prisma.musteri.findUnique({
    where: { id: musteriId },
  });

  if (!musteri) return null;

  const [ogrenciler, onKayitlar] = await Promise.all([
    getCustomerStudents(musteriId),
    getCustomerHistory(musteriId),
  ]);

  return {
    musteri,
    ogrenciler,
    onKayitlar,
    totalRequests: onKayitlar.length,
    newRequests: onKayitlar.filter((r) => r.status === "YENI").length,
  };
}

export async function getAllCustomers(limit = 100) {
  return prisma.musteri.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
