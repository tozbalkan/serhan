"use server";

// Admin Pages Server Actions (Phase 7)
//
// These Server Actions handle all CMS page operations.
// All operations require admin authentication (checked at route level).

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/slug";
import {
  pageCreateSchema,
  pageUpdateSchema,
  pagePublishSchema,
} from "@/lib/validation/cms";

/**
 * Create a new page.
 * Slug is generated server-side from the title and is immutable.
 */
export async function createPage(input: unknown) {
  const parsed = pageCreateSchema.parse(input);

  const slug = generateSlug(parsed.title);

  // Check if slug already exists
  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    throw new Error("Slug already exists");
  }

  const page = await prisma.page.create({
    data: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/icerik/sayfalar");
  return page;
}

/**
 * Update an existing page.
 * Note: slug is immutable and not updatable.
 */
export async function updatePage(input: unknown) {
  const parsed = pageUpdateSchema.parse(input);

  const page = await prisma.page.update({
    where: { id: parsed.id },
    data: {
      title: parsed.title,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
    },
  });

  revalidatePath("/admin/icerik/sayfalar");
  revalidatePath(`/kurumsal/${page.slug}`);
  return page;
}

/**
 * Publish or unpublish a page.
 */
export async function publishPage(input: unknown) {
  const parsed = pagePublishSchema.parse(input);

  const page = await prisma.page.update({
    where: { id: parsed.id },
    data: { status: parsed.status },
  });

  revalidatePath("/admin/icerik/sayfalar");
  revalidatePath(`/kurumsal/${page.slug}`);
  return page;
}

/**
 * Get a page by ID for admin edit.
 */
export async function getPageForAdmin(id: string) {
  return prisma.page.findUnique({
    where: { id },
  });
}

/**
 * List all pages for admin (including drafts).
 */
export async function listPagesForAdmin() {
  return prisma.page.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
}

/**
 * Delete a page.
 */
export async function deletePage(id: string) {
  const page = await prisma.page.delete({
    where: { id },
  });

  revalidatePath("/admin/icerik/sayfalar");
  revalidatePath(`/kurumsal/${page.slug}`);
  return page;
}
