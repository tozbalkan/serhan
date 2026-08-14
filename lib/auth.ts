// Authentication foundation for the lightweight admin phase.
//
// This is intentionally small and explicit: the application is prepared for
// admin auth, but it does not implement a large RBAC system or a full identity
// provider. The current implementation is a minimal server-side session seam that
// keeps admin data behind a route guard and allows a single admin login to be
// configured via environment variables.

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const ADMIN_ROUTE_PREFIX = "/admin";
export const ADMIN_SESSION_COOKIE = "serhan_admin_session";

export type AdminSession = {
  userId: string;
  email: string;
};

const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

function decodeSessionCookie(raw: string | undefined): AdminSession | null {
  if (!raw) return null;

  try {
    const decoded = Buffer.from(raw, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as Partial<AdminSession>;
    if (!parsed.userId || !parsed.email) return null;
    return { userId: parsed.userId, email: parsed.email };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return decodeSessionCookie(raw);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function loginAdmin(formData: FormData): Promise<void> {
  "use server";

  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error("E-posta ve şifre gereklidir.");
  }

  const email = process.env.ADMIN_LOGIN_EMAIL;
  const password = process.env.ADMIN_LOGIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Admin authentication is not configured for this environment.");
  }

  if (parsed.data.email !== email || parsed.data.password !== password) {
    throw new Error("Geçersiz admin bilgileri.");
  }

  const session: AdminSession = {
    userId: "admin",
    email,
  };

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, Buffer.from(JSON.stringify(session)).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
