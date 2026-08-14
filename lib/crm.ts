// CRM foundation — customer and student identity resolution (Phase 6)
//
// This module implements minimal, deterministic customer and student matching
// for the Serhan Turizm pre-registration flow. The strategy is conservative:
// we avoid merging potentially different people, and we preserve all
// historical OnKayit records without modification.
//
// Matching strategy:
//   - Customers: primary key is phone (after normalization), secondary is email
//   - Students: first name + last name + school (within a customer)
//   - No fuzzy matching, no AI, no automatic merging on ambiguous data
//
// Historical data preservation:
//   - OnKayit fields (ogrenciAd, ogrenciSoyad, sinifKademe, etc.) are never
//     retroactively changed. They record the state at submission time.
//   - Current Ogrenci.sinifKademe may be updated when a student is re-matched
//     if the class changed, but the OnKayit record remains unchanged.

import "server-only";
import { prisma } from "@/lib/db";

// Normalize phone for matching: remove spaces, dashes, parentheses, etc.
// Return as digits only. This allows flexible input while matching deterministically.
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// Normalize email for matching: trim and lowercase.
function normalizeEmail(email: string | undefined): string | undefined {
  if (!email) return undefined;
  return email.trim().toLowerCase();
}

export type ResolveCustomerInput = {
  adSoyad: string;
  telefon: string;
  eposta?: string;
};

export type ResolveCustomerResult = {
  id: string;
  adSoyad: string;
  telefon: string;
  eposta: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Resolve or create a customer (Musteri) based on phone/email matching.
 *
 * Primary key: normalized phone number (must be unique).
 * Secondary key: normalized email (when phone is not available).
 *
 * If no match is found, create a new customer.
 * If a customer is found, return it unchanged (this phase does not update
 * existing customer data; that can be added later with more sophisticated rules).
 */
export async function resolveOrCreateCustomer(
  input: ResolveCustomerInput,
): Promise<ResolveCustomerResult> {
  const normalizedPhone = normalizePhone(input.telefon);
  const normalizedEmail = normalizeEmail(input.eposta);

  if (!normalizedPhone) {
    throw new Error("Telefon numarası gerekli.");
  }

  // Try to find an existing customer by phone (primary key).
  let customer = await prisma.musteri.findUnique({
    where: { telefon: normalizedPhone },
  });

  if (customer) {
    return customer;
  }

  // If phone didn't match and we have an email, try email as secondary key.
  // Note: email is not a unique constraint in the schema (to allow null),
  // but we'll search for the first match.
  if (normalizedEmail) {
    customer = await prisma.musteri.findFirst({
      where: { eposta: normalizedEmail, telefon: { not: normalizedPhone } },
    });

    if (customer) {
      return customer;
    }
  }

  // No match found. Create a new customer.
  customer = await prisma.musteri.create({
    data: {
      adSoyad: input.adSoyad,
      telefon: normalizedPhone,
      eposta: normalizedEmail ?? null,
    },
  });

  return customer;
}

export type ResolveStudentInput = {
  musteriId: string;
  okulId: string;
  ad: string;
  soyad: string;
  sinifKademe: string;
};

export type ResolveStudentResult = {
  id: string;
  musteriId: string;
  okulId: string;
  ad: string;
  soyad: string;
  sinifKademe: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Resolve or create a student (Ogrenci) within a customer.
 *
 * Matching key: first name + last name + school (within the same customer).
 *
 * If a matching student is found:
 *   - Update the class (sinifKademe) if different (allows progression tracking).
 *   - Return the student.
 *
 * If no match:
 *   - Create a new student.
 */
export async function resolveOrCreateStudent(
  input: ResolveStudentInput,
): Promise<ResolveStudentResult> {
  // Look for an existing student with the same name and school within this customer.
  // Use case-insensitive matching to handle minor variations (e.g. "Ali" vs "ali").
  let student = await prisma.ogrenci.findFirst({
    where: {
      musteriId: input.musteriId,
      okulId: input.okulId,
      ad: { equals: input.ad, mode: "insensitive" },
      soyad: { equals: input.soyad, mode: "insensitive" },
    },
  });

  if (student) {
    // If the class has changed, update it to the current value.
    // This allows tracking progression without creating duplicate students.
    if (student.sinifKademe !== input.sinifKademe) {
      student = await prisma.ogrenci.update({
        where: { id: student.id },
        data: { sinifKademe: input.sinifKademe },
      });
    }
    return student;
  }

  // No match found. Create a new student.
  student = await prisma.ogrenci.create({
    data: {
      musteriId: input.musteriId,
      okulId: input.okulId,
      ad: input.ad,
      soyad: input.soyad,
      sinifKademe: input.sinifKademe,
    },
  });

  return student;
}

/**
 * Find all historical OnKayit records for a customer across all request types.
 * Used in admin views to show customer history.
 */
export async function getCustomerHistory(musteriId: string) {
  const onKayitlar = await prisma.onKayit.findMany({
    where: { musteriId },
    include: {
      okul: { select: { ad: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return onKayitlar;
}

/**
 * Find all students belonging to a customer.
 */
export async function getCustomerStudents(musteriId: string) {
  return prisma.ogrenci.findMany({
    where: { musteriId },
    include: {
      okul: { select: { ad: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
