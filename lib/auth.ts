// Authentication foundation (bootstrap phase).
//
// This is intentionally minimal. It only establishes the SEAM for future admin
// authentication. No login UI, no password reset, no user management, no RBAC.
//
// When the authentication phase lands, the admin session verification will be
// implemented here (e.g. reading a signed session cookie) and exported through
// a server-only helper such as `getAdminSession()`.

import "server-only";

export const ADMIN_ROUTE_PREFIX = "/admin";

// Placeholder for the future admin session contract.
// Will be replaced with a real, type-safe session shape in a later phase.
export type AdminSession = {
  userId: string;
  email: string;
};

// TODO(phase): implement getAdminSession() once the auth provider is chosen.
// For now we expose nothing that performs authentication.
