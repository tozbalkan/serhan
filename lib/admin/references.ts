"use server";

// Admin References Server Actions (Phase 7)

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  referenceCreateSchema,
  referenceUpdateSchema,
  referenceToggleSchema,
  referenceSortOrderSchema,
} from "@/lib/validation/cms";

export async function createReference(input: unknown) {
  const parsed = referenceCreateSchema.parse(input);

  const reference = await prisma.reference.create({
    data: {
      name: parsed.name,
      logoUrl: parsed.logoUrl || null,
      websiteUrl: parsed.websiteUrl || null,
      description: parsed.description || null,
    },
  });

  revalidatePath("/admin/icerik/referanslar");
  revalidatePath("/referanslar");
  return reference;
}

export async function updateReference(input: unknown) {
  const parsed = referenceUpdateSchema.parse(input);

  const reference = await prisma.reference.update({
    where: { id: parsed.id },
    data: {
      name: parsed.name,
      logoUrl: parsed.logoUrl || null,
      websiteUrl: parsed.websiteUrl || null,
      description: parsed.description || null,
    },
  });

  revalidatePath("/admin/icerik/referanslar");
  revalidatePath("/referanslar");
  return reference;
}

export async function setReferenceActive(input: unknown) {
  const parsed = referenceToggleSchema.parse(input);

  const reference = await prisma.reference.update({
    where: { id: parsed.id },
    data: { active: parsed.active },
  });

  revalidatePath("/admin/icerik/referanslar");
  revalidatePath("/referanslar");
  return reference;
}

export async function setReferenceSortOrder(input: unknown) {
  const parsed = referenceSortOrderSchema.parse(input);

  const reference = await prisma.reference.update({
    where: { id: parsed.id },
    data: { sortOrder: parsed.sortOrder },
  });

  revalidatePath("/admin/icerik/referanslar");
  return reference;
}

export async function getReferenceForAdmin(id: string) {
  return prisma.reference.findUnique({
    where: { id },
  });
}

export async function listReferencesForAdmin() {
  return prisma.reference.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function deleteReference(id: string) {
  await prisma.reference.delete({
    where: { id },
  });

  revalidatePath("/admin/icerik/referanslar");
  revalidatePath("/referanslar");
}
