"use server";

// Admin Services Server Actions (Phase 7)

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/slug";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceToggleSchema,
  serviceSortOrderSchema,
} from "@/lib/validation/cms";

export async function createService(input: unknown) {
  const parsed = serviceCreateSchema.parse(input);

  const slug = generateSlug(parsed.name);

  const existing = await prisma.service.findUnique({ where: { slug } });
  if (existing) {
    throw new Error("Slug already exists");
  }

  const service = await prisma.service.create({
    data: {
      name: parsed.name,
      slug,
      shortDescription: parsed.shortDescription || null,
      content: parsed.content,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidatePath("/admin/icerik/hizmetler");
  return service;
}

export async function updateService(input: unknown) {
  const parsed = serviceUpdateSchema.parse(input);

  const service = await prisma.service.update({
    where: { id: parsed.id },
    data: {
      name: parsed.name,
      shortDescription: parsed.shortDescription || null,
      content: parsed.content,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidatePath("/admin/icerik/hizmetler");
  revalidatePath(`/hizmetler/${service.slug}`);
  return service;
}

export async function setServiceActive(input: unknown) {
  const parsed = serviceToggleSchema.parse(input);

  const service = await prisma.service.update({
    where: { id: parsed.id },
    data: { active: parsed.active },
  });

  revalidatePath("/admin/icerik/hizmetler");
  revalidatePath(`/hizmetler/${service.slug}`);
  return service;
}

export async function setServiceSortOrder(input: unknown) {
  const parsed = serviceSortOrderSchema.parse(input);

  const service = await prisma.service.update({
    where: { id: parsed.id },
    data: { sortOrder: parsed.sortOrder },
  });

  revalidatePath("/admin/icerik/hizmetler");
  return service;
}

export async function getServiceForAdmin(id: string) {
  return prisma.service.findUnique({
    where: { id },
  });
}

export async function listServicesForAdmin() {
  return prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function deleteService(id: string) {
  const service = await prisma.service.delete({
    where: { id },
  });

  revalidatePath("/admin/icerik/hizmetler");
  revalidatePath(`/hizmetler/${service.slug}`);
  return service;
}
