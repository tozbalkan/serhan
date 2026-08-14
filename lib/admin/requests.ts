import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { maskStoredTcKimlik } from "@/lib/tc-kimlik";
import { sendOnKayitAdminNotification } from "@/lib/resend";

export const requestTypes = [
  "TEKLIF",
  "IS_BASVURUSU",
  "ILETISIM",
  "ARAC_GERI_BILDIRIM",
  "ON_KAYIT",
] as const;

export type UnifiedRequestType = (typeof requestTypes)[number];

export type RequestListItem = {
  id: string;
  type: UnifiedRequestType;
  summary: string;
  status: "YENI" | "INCELENIYOR" | "ILETISIME_GECILDI" | "TAMAMLANDI";
  createdAt: Date;
};

export type RequestListResponse = {
  items: RequestListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const actionStatusSchema = z.enum(["YENI", "INCELENIYOR", "ILETISIME_GECILDI", "TAMAMLANDI"]);
const actionTypeSchema = z.enum(requestTypes);

const requestSummary = {
  TEKLIF: (row: { adSoyad: string; eposta: string | null; telefon: string | null }) =>
    `${row.adSoyad || "Teklif"} · ${row.eposta || row.telefon || "İletişim bilgisi yok"}`,
  IS_BASVURUSU: (row: { adSoyad: string; eposta: string | null; telefon: string | null }) =>
    `${row.adSoyad || "İş başvurusu"} · ${row.eposta || row.telefon || "İletişim bilgisi yok"}`,
  ILETISIM: (row: { adSoyad: string; eposta: string | null; telefon: string | null }) =>
    `${row.adSoyad || "İletişim"} · ${row.eposta || row.telefon || "İletişim bilgisi yok"}`,
  ARAC_GERI_BILDIRIM: (row: { adSoyad: string; eposta: string | null; telefon: string | null }) =>
    `${row.adSoyad || "Araç geri bildirim"} · ${row.eposta || row.telefon || "İletişim bilgisi yok"}`,
  ON_KAYIT: (row: { ogrenciAd: string; ogrenciSoyad: string; okul: { ad: string } | null }) =>
    `${row.ogrenciAd} ${row.ogrenciSoyad} · ${row.okul?.ad ?? "Okul"}`,
} as const;

function mapStatus(value: string): RequestListItem["status"] {
  return actionStatusSchema.parse(value) as RequestListItem["status"];
}

async function countByType() {
  const [teklif, isBasvuru, iletisim, aracGeriBildirim, onKayit] = await Promise.all([
    prisma.teklif.count(),
    prisma.isBasvuru.count(),
    prisma.iletisim.count(),
    prisma.aracGeriBildirim.count(),
    prisma.onKayit.count(),
  ]);

  return {
    TEKLIF: teklif,
    IS_BASVURUSU: isBasvuru,
    ILETISIM: iletisim,
    ARAC_GERI_BILDIRIM: aracGeriBildirim,
    ON_KAYIT: onKayit,
  };
}

export async function listRequests(input?: {
  page?: number;
  limit?: number;
  type?: UnifiedRequestType | "TUMU";
  status?: RequestListItem["status"] | "TUMU";
  search?: string;
}): Promise<RequestListResponse> {
  const page = Math.max(1, Number(input?.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(input?.limit ?? 20)));
  const typeFilter = input?.type ?? "TUMU";
  const statusFilter = input?.status ?? "TUMU";
  const search = (input?.search ?? "").trim();

  const selectedTypes: UnifiedRequestType[] =
    typeFilter === "TUMU" ? [...requestTypes] : [actionTypeSchema.parse(typeFilter)];

  const perTypeItems = await Promise.all(
    selectedTypes.map(async (type) => {
      const searchMode = "insensitive" as const;
      const base: { where: Record<string, unknown> } = {
        where: {
          ...(statusFilter !== "TUMU" ? { status: statusFilter } : {}),
        },
      };

      if (search) {
        if (type === "ON_KAYIT") {
          base.where.OR = [
            { ogrenciAd: { contains: search, mode: searchMode } },
            { ogrenciSoyad: { contains: search, mode: searchMode } },
            { veliAdSoyad: { contains: search, mode: searchMode } },
            { telefon: { contains: search, mode: searchMode } },
            { eposta: { contains: search, mode: searchMode } },
            { adres: { contains: search, mode: searchMode } },
            { okul: { ad: { contains: search, mode: searchMode } } },
          ];
        } else {
          base.where.OR = [
            { adSoyad: { contains: search, mode: searchMode } },
            { telefon: { contains: search, mode: searchMode } },
            { eposta: { contains: search, mode: searchMode } },
            { mesaj: { contains: search, mode: searchMode } },
          ];
        }
      }

      if (type === "TEKLIF") {
        const rows = await prisma.teklif.findMany({
          ...base,
          select: {
            id: true,
            adSoyad: true,
            telefon: true,
            eposta: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        return rows.map((row) => ({
          id: row.id,
          type: "TEKLIF" as const,
          summary: requestSummary.TEKLIF(row),
          status: mapStatus(row.status),
          createdAt: row.createdAt,
        }));
      }

      if (type === "IS_BASVURUSU") {
        const rows = await prisma.isBasvuru.findMany({
          ...base,
          select: {
            id: true,
            adSoyad: true,
            telefon: true,
            eposta: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        return rows.map((row) => ({
          id: row.id,
          type: "IS_BASVURUSU" as const,
          summary: requestSummary.IS_BASVURUSU(row),
          status: mapStatus(row.status),
          createdAt: row.createdAt,
        }));
      }

      if (type === "ILETISIM") {
        const rows = await prisma.iletisim.findMany({
          ...base,
          select: {
            id: true,
            adSoyad: true,
            telefon: true,
            eposta: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        return rows.map((row) => ({
          id: row.id,
          type: "ILETISIM" as const,
          summary: requestSummary.ILETISIM(row),
          status: mapStatus(row.status),
          createdAt: row.createdAt,
        }));
      }

      if (type === "ARAC_GERI_BILDIRIM") {
        const rows = await prisma.aracGeriBildirim.findMany({
          ...base,
          select: {
            id: true,
            adSoyad: true,
            telefon: true,
            eposta: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        return rows.map((row) => ({
          id: row.id,
          type: "ARAC_GERI_BILDIRIM" as const,
          summary: requestSummary.ARAC_GERI_BILDIRIM(row),
          status: mapStatus(row.status),
          createdAt: row.createdAt,
        }));
      }

      const rows = await prisma.onKayit.findMany({
        ...base,
        select: {
          id: true,
          ogrenciAd: true,
          ogrenciSoyad: true,
          status: true,
          createdAt: true,
          okul: { select: { ad: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return rows.map((row) => ({
        id: row.id,
        type: "ON_KAYIT" as const,
        summary: requestSummary.ON_KAYIT(row),
        status: mapStatus(row.status),
        createdAt: row.createdAt,
      }));
    }),
  );

  const allItems = perTypeItems.flat().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const total = allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageStart = (page - 1) * limit;
  const items = allItems.slice(pageStart, pageStart + limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getRequestDetail(type: UnifiedRequestType, id: string) {
  if (type === "TEKLIF") {
    return prisma.teklif.findUnique({
      where: { id },
      select: {
        id: true,
        adSoyad: true,
        telefon: true,
        eposta: true,
        mesaj: true,
        status: true,
        createdAt: true,
      },
    });
  }

  if (type === "IS_BASVURUSU") {
    return prisma.isBasvuru.findUnique({
      where: { id },
      select: {
        id: true,
        adSoyad: true,
        telefon: true,
        eposta: true,
        mesaj: true,
        status: true,
        createdAt: true,
      },
    });
  }

  if (type === "ILETISIM") {
    return prisma.iletisim.findUnique({
      where: { id },
      select: {
        id: true,
        adSoyad: true,
        telefon: true,
        eposta: true,
        mesaj: true,
        status: true,
        createdAt: true,
      },
    });
  }

  if (type === "ARAC_GERI_BILDIRIM") {
    return prisma.aracGeriBildirim.findUnique({
      where: { id },
      select: {
        id: true,
        adSoyad: true,
        telefon: true,
        eposta: true,
        mesaj: true,
        status: true,
        createdAt: true,
      },
    });
  }

  return prisma.onKayit.findUnique({
    where: { id },
    include: {
      okul: { select: { ad: true, slug: true } },
      musteri: { select: { id: true, adSoyad: true, telefon: true, eposta: true, createdAt: true } },
      ogrenci: {
        select: {
          id: true,
          ad: true,
          soyad: true,
          sinifKademe: true,
          okul: { select: { ad: true } },
        },
      },
      consent: true,
    },
  });
}

export async function updateRequestStatus(input: {
  id: string;
  type: UnifiedRequestType;
  status: RequestListItem["status"];
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = z
    .object({
      id: z.string().min(1),
      type: actionTypeSchema,
      status: actionStatusSchema,
    })
    .safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Geçersiz talep durumu." };
  }

  const { id, type, status } = parsed.data;

  if (type === "TEKLIF") {
    const exists = await prisma.teklif.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { ok: false, error: "Talep bulunamadı." };
    await prisma.teklif.update({ where: { id }, data: { status } });
  } else if (type === "IS_BASVURUSU") {
    const exists = await prisma.isBasvuru.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { ok: false, error: "Talep bulunamadı." };
    await prisma.isBasvuru.update({ where: { id }, data: { status } });
  } else if (type === "ILETISIM") {
    const exists = await prisma.iletisim.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { ok: false, error: "Talep bulunamadı." };
    await prisma.iletisim.update({ where: { id }, data: { status } });
  } else if (type === "ARAC_GERI_BILDIRIM") {
    const exists = await prisma.aracGeriBildirim.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { ok: false, error: "Talep bulunamadı." };
    await prisma.aracGeriBildirim.update({ where: { id }, data: { status } });
  } else {
    const exists = await prisma.onKayit.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { ok: false, error: "Talep bulunamadı." };
    await prisma.onKayit.update({ where: { id }, data: { status } });
  }

  revalidatePath("/admin/talepler");
  revalidatePath("/admin");
  return { ok: true };
}

export async function changeRequestStatus(formData: FormData): Promise<void> {
  "use server";

  const id = String(formData.get("id") ?? "");
  const type = String(formData.get("type") ?? "");
  const status = String(formData.get("status") ?? "");

  const result = await updateRequestStatus({
    id,
    type: actionTypeSchema.parse(type),
    status: actionStatusSchema.parse(status),
  });

  if (!result.ok) {
    throw new Error(result.error ?? "Durum güncellenemedi.");
  }

  const detailUrl = `/admin/talepler/${type.toLowerCase().replace(/_/g, "-")}/${id}`;
  revalidatePath(detailUrl);
  revalidatePath("/admin/talepler");
}

export async function resendOnKayitNotification(input: { id: string }): Promise<{ ok: boolean; error?: string }> {
  const parsed = z.object({ id: z.string().min(1) }).safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Geçersiz talep." };
  }

  const kayit = await prisma.onKayit.findUnique({
    where: { id: parsed.data.id },
    include: { okul: { select: { ad: true } } },
  });

  if (!kayit) {
    return { ok: false, error: "Ön kayıt bulunamadı." };
  }

  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "Resend API key tanımlı değil." };
  }

  try {
    await sendOnKayitAdminNotification({
      okulAd: kayit.okul.ad,
      ogrenciAd: kayit.ogrenciAd,
      ogrenciSoyad: kayit.ogrenciSoyad,
      sinifKademe: kayit.sinifKademe,
      veliAdSoyad: kayit.veliAdSoyad,
      telefon: kayit.telefon,
      eposta: kayit.eposta,
      adres: kayit.adres,
      tcKimlikMasked: kayit.tcKimlikNo ? maskStoredTcKimlik(kayit.tcKimlikNo) : null,
      status: kayit.status,
      createdAt: kayit.createdAt.toLocaleString("tr-TR"),
    });

    await prisma.onKayit.update({
      where: { id: kayit.id },
      data: { notificationSent: true, notificationSentAt: new Date() },
    });

    revalidatePath("/admin/talepler");
    revalidatePath(`/admin/talepler/on-kayit/${kayit.id}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Bildirim gönderilemedi." };
  }
}

export async function countUnifiedRequests() {
  return countByType();
}
