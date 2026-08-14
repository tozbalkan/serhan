"use server";

// Admin BlogPost Server Actions (Phase 7)

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/slug";
import {
  blogPostCreateSchema,
  blogPostUpdateSchema,
  blogPostPublishSchema,
} from "@/lib/validation/cms";

export async function createBlogPost(input: unknown) {
  const parsed = blogPostCreateSchema.parse(input);

  const slug = generateSlug(parsed.title);

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    throw new Error("Slug already exists");
  }

  const post = await prisma.blogPost.create({
    data: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/icerik/blog");
  return post;
}

export async function updateBlogPost(input: unknown) {
  const parsed = blogPostUpdateSchema.parse(input);

  const post = await prisma.blogPost.update({
    where: { id: parsed.id },
    data: {
      title: parsed.title,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
    },
  });

  revalidatePath("/admin/icerik/blog");
  revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function publishBlogPost(input: unknown) {
  const parsed = blogPostPublishSchema.parse(input);

  const post = await prisma.blogPost.update({
    where: { id: parsed.id },
    data: {
      status: parsed.status,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/icerik/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
  return post;
}

export async function getBlogPostForAdmin(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  });
}

export async function listBlogPostsForAdmin() {
  return prisma.blogPost.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blogPost.delete({
    where: { id },
  });

  revalidatePath("/admin/icerik/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
  return post;
}
