"use server";

// School mutations (Phase 3) — Server Actions.
//
// This module is marked "use server" so that Client Components importing these
// functions receive only a reference (the code never runs in the browser). That
// keeps the Prisma client and `pg` out of the client bundle.
//
// Security notes:
//   - All inputs are validated with Zod before touching the database.
//   - The `slug` is generated once at creation and is NEVER accepted from the
//     client on update (immutability). The database enforces uniqueness; we
//     also resolve collisions deterministically here.
//   - Mutations locate records by `id` (never a client-provided slug/identity)
//     and only ever write the fields the spec allows.
//   - Authorization is intentionally OUT of scope; the signatures leave room to
//     add an auth/authorization guard later without rewriting the logic.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { uniqueSlug } from "@/lib/slug";
import {
  schoolCreateSchema,
  schoolUpdateSchema,
  schoolToggleSchema,
  type SchoolCreateInput,
  type SchoolUpdateInput,
  type SchoolToggleInput,
} from "@/lib/validation";

// Create a school. The slug is generated from the name and is unique + immutable.
export async function createSchool(input: SchoolCreateInput): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  const parsed = schoolCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Geçersiz okul bilgileri." };
  }
  const { ad, tcKimlikIster } = parsed.data;

  const existing = await prisma.okul.findMany({ select: { slug: true } });
  const slug = uniqueSlug(ad, new Set(existing.map((e) => e.slug)));

  const created = await prisma.okul.create({
    data: { ad, slug, tcKimlikIster },
    select: { id: true },
  });

  revalidatePath("/admin/okullar");
  return { ok: true, id: created.id };
}

// Update a school. Only `ad`, `aktif`, `tcKimlikIster` may change. The slug and
// every other field are deliberately excluded from the write.
export async function updateSchool(input: SchoolUpdateInput): Promise<{
  ok: boolean;
  error?: string;
}> {
  const parsed = schoolUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Geçersiz okul bilgileri." };
  }
  const { id, ad, aktif, tcKimlikIster } = parsed.data;

  const exists = await prisma.okul.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) {
    return { ok: false, error: "Okul bulunamadı." };
  }

  await prisma.okul.update({
    where: { id },
    data: { ad, aktif, tcKimlikIster },
  });

  revalidatePath("/admin/okullar");
  return { ok: true };
}

// Toggle active/inactive state. Never touches the slug.
export async function setSchoolActive(input: SchoolToggleInput): Promise<{
  ok: boolean;
  error?: string;
}> {
  const parsed = schoolToggleSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Geçersiz istek." };
  }
  const { id, aktif } = parsed.data;

  const exists = await prisma.okul.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) {
    return { ok: false, error: "Okul bulunamadı." };
  }

  await prisma.okul.update({
    where: { id },
    data: { aktif },
  });

  revalidatePath("/admin/okullar");
  return { ok: true };
}
