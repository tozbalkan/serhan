// CMS public query layer (Phase 7)
//
// These functions are the single source of truth for public content retrieval.
// They enforce security: only published/active content is returned.
// Never use Prisma directly for public queries; always use these functions.

import "server-only";
import { prisma } from "@/lib/db";

// --- Page queries ---

/**
 * Get a published page by slug.
 * Returns null if not found or not published.
 */
export async function getPublishedPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      seoTitle: true,
      seoDescription: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// --- Service queries ---

/**
 * Get an active service by slug.
 * Returns null if not found or not active.
 */
export async function getActiveServiceBySlug(slug: string) {
  return prisma.service.findFirst({
    where: {
      slug,
      active: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      content: true,
      imageUrl: true,
      seoTitle: true,
      seoDescription: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * List all published/active services, ordered by sortOrder.
 */
export async function listActiveServices() {
  return prisma.service.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      content: true,
      imageUrl: true,
      seoTitle: true,
      seoDescription: true,
      createdAt: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

// --- Reference queries ---

/**
 * List all active references, ordered by sortOrder.
 */
export async function listActiveReferences() {
  return prisma.reference.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      websiteUrl: true,
      description: true,
      createdAt: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

// --- FAQ queries ---

/**
 * List all active FAQs, ordered by sortOrder.
 */
export async function listActiveFaqs() {
  return prisma.faqItem.findMany({
    where: { active: true },
    select: {
      id: true,
      question: true,
      answer: true,
      createdAt: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

// --- BlogPost queries ---

/**
 * Get a published blog post by slug.
 * Returns null if not found or not published.
 */
export async function getPublishedBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      publishedAt: true,
      seoTitle: true,
      seoDescription: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * List all published blog posts, ordered by publishedAt descending.
 */
export async function listPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}
