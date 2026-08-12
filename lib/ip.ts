// Client IP resolution (bootstrap phase).
//
// Deployment target is Vercel. On Vercel, the originating client IP is found in
// the `x-forwarded-for` header as a comma-separated list; the leftmost entry is
// the original client.
//
// This logic is intentionally isolated so it can be swapped if the deployment
// infrastructure changes (e.g. a different proxy or load balancer). Do not build
// additional networking abstraction around it.

import "server-only";

export type RequestHeaders = {
  get(name: string): string | null;
};

export function getClientIp(headers: RequestHeaders): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() ?? null;
}
