// CMS content validation schemas (Phase 7)
//
// These schemas are used for both admin form validation and server-side
// mutation validation. Keep them focused and explicit.

import { z } from "zod";

// --- Page ---

export const pageCreateSchema = z.object({
  title: z.string().trim().min(1, "Başlık gereklidir.").max(200),
  slug: z.string().trim().min(1).max(200), // generated server-side, but validated for format
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().min(1, "İçerik gereklidir."),
});

export type PageCreateInput = z.infer<typeof pageCreateSchema>;

export const pageUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Başlık gereklidir.").max(200),
  // slug is immutable, not included in updates
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().min(1, "İçerik gereklidir."),
});

export type PageUpdateInput = z.infer<typeof pageUpdateSchema>;

export const pagePublishSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type PagePublishInput = z.infer<typeof pagePublishSchema>;

// --- Service ---

export const serviceCreateSchema = z.object({
  name: z.string().trim().min(1, "Hizmet adı gereklidir.").max(200),
  slug: z.string().trim().min(1).max(200), // generated server-side
  shortDescription: z.string().trim().max(300).optional(),
  content: z.string().min(1, "İçerik gereklidir."),
  imageUrl: z.string().trim().max(500).optional(),
});

export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;

export const serviceUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Hizmet adı gereklidir.").max(200),
  // slug is immutable
  shortDescription: z.string().trim().max(300).optional(),
  content: z.string().min(1, "İçerik gereklidir."),
  imageUrl: z.string().trim().max(500).optional(),
});

export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;

export const serviceToggleSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
});

export type ServiceToggleInput = z.infer<typeof serviceToggleSchema>;

export const serviceSortOrderSchema = z.object({
  id: z.string().min(1),
  sortOrder: z.number().int().min(0),
});

export type ServiceSortOrderInput = z.infer<typeof serviceSortOrderSchema>;

// --- Reference ---

export const referenceCreateSchema = z.object({
  name: z.string().trim().min(1, "İsim gereklidir.").max(200),
  logoUrl: z.string().trim().max(500).optional(),
  websiteUrl: z.string().trim().max(500).optional(),
  description: z.string().trim().max(1000).optional(),
});

export type ReferenceCreateInput = z.infer<typeof referenceCreateSchema>;

export const referenceUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "İsim gereklidir.").max(200),
  logoUrl: z.string().trim().max(500).optional(),
  websiteUrl: z.string().trim().max(500).optional(),
  description: z.string().trim().max(1000).optional(),
});

export type ReferenceUpdateInput = z.infer<typeof referenceUpdateSchema>;

export const referenceToggleSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
});

export type ReferenceToggleInput = z.infer<typeof referenceToggleSchema>;

export const referenceSortOrderSchema = z.object({
  id: z.string().min(1),
  sortOrder: z.number().int().min(0),
});

export type ReferenceSortOrderInput = z.infer<typeof referenceSortOrderSchema>;

// --- FAQ ---

export const faqCreateSchema = z.object({
  question: z.string().trim().min(1, "Soru gereklidir.").max(500),
  answer: z.string().min(1, "Cevap gereklidir."),
});

export type FaqCreateInput = z.infer<typeof faqCreateSchema>;

export const faqUpdateSchema = z.object({
  id: z.string().min(1),
  question: z.string().trim().min(1, "Soru gereklidir.").max(500),
  answer: z.string().min(1, "Cevap gereklidir."),
});

export type FaqUpdateInput = z.infer<typeof faqUpdateSchema>;

export const faqToggleSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
});

export type FaqToggleInput = z.infer<typeof faqToggleSchema>;

export const faqSortOrderSchema = z.object({
  id: z.string().min(1),
  sortOrder: z.number().int().min(0),
});

export type FaqSortOrderInput = z.infer<typeof faqSortOrderSchema>;

// --- BlogPost ---

export const blogPostCreateSchema = z.object({
  title: z.string().trim().min(1, "Başlık gereklidir.").max(200),
  slug: z.string().trim().min(1).max(200), // generated server-side
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().min(1, "İçerik gereklidir."),
  coverImage: z.string().trim().max(500).optional(),
});

export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;

export const blogPostUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Başlık gereklidir.").max(200),
  // slug is immutable
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().min(1, "İçerik gereklidir."),
  coverImage: z.string().trim().max(500).optional(),
});

export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;

export const blogPostPublishSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type BlogPostPublishInput = z.infer<typeof blogPostPublishSchema>;
