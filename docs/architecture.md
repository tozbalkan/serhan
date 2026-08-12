# Architecture — Serhan Turizm

> **Permanent convention.** Any future coding agent modifying this repository
> MUST read `docs/architecture.md` and `docs/frontend-rules.md` before changing
> architecture or frontend code.

## Philosophy: basic-first

Serhan Turizm is a **basic**, fast, purpose-driven corporate website with a
lightweight admin panel and a few request flows. We deliberately avoid
over-engineering:

- No microservices, no separate backend services.
- No Redis, Kafka, queues, event sourcing, CQRS.
- No AI infrastructure, vector databases, or separate CMS products.
- No unnecessary abstraction layers, repositories, services, or factories.
- No complex state management.

If you are tempted to add infrastructure "for scale," stop. This system does not
need it yet.

## Modular monolith

A single Next.js application, a single PostgreSQL database, a single deployment.

```
PUBLIC WEBSITE
├── Corporate website
├── School service QR registration   (/on-kayit/[slug])
└── Vehicle QR feedback

ADMIN
├── Dashboard
├── Unified Requests
├── Schools
└── Content management

DATABASE
├── Requests
├── Schools
├── Consent
├── CMS content
└── Admin users
```

Admin and public website live in the **same** Next.js application. There are no
separate services. Example URLs:

- `serhanturizm.com/`
- `serhanturizm.com/on-kayit/abc-koleji`
- `serhanturizm.com/admin`

### Public / admin separation

Separation is by **route segment**, not by deployment:

- `app/(website)/` — public corporate site
- `app/on-kayit/[slug]/` — public QR pre-registration entry
- `app/admin/` — admin panel

Both share the same `lib/`, `prisma/`, and `styles/`.

## Tech stack

| Concern        | Choice                                    |
| -------------- | ----------------------------------------- |
| Framework      | Next.js (App Router)                      |
| UI             | React + TypeScript (strict)               |
| Styling        | Vanilla Extract (design tokens only)      |
| Database       | PostgreSQL                                |
| ORM            | Prisma                                    |
| Validation     | Zod (shared client/server schemas)        |
| Email          | Resend                                    |
| QR codes       | `qrcode`                                  |
| Deployment     | Vercel                                    |

### Prisma (v7) specifics

- The client is generated to `prisma/generated/prisma` (outside `node_modules`)
  via the `prisma-client` provider. Generated output is git-ignored.
- The `prisma-client` provider **requires a driver adapter** for PostgreSQL.
  We use `@prisma/adapter-pg` with the native `pg` pool, wired in `lib/db.ts`.
- The database URL is configured in `prisma.config.ts` (not in `schema.prisma`)
  and read from `DATABASE_URL`.
- Regenerate with `npx prisma generate` after schema changes.

### Authentication

The architecture is **ready for admin authentication** but does not implement a
complex auth system in the bootstrap phase. `lib/auth.ts` establishes only the
seam (admin route prefix and a placeholder `AdminSession` type). Login UI,
password reset, user management, and RBAC arrive in a later phase.

## Future domain boundaries

The Prisma domain will later include (not yet implemented):

- `Okul`
- `OnKayit`
- `Consent`
- `Teklif`
- `IsBasvuru`
- `Iletisim`
- `AracGeriBildirim`
- `User`

These are intentionally absent from `prisma/schema.prisma` during bootstrap.

## Legal document versioning

Legal documents are versioned as **files in the repository**, not in a CMS.

```
legal/
├── kvkk-aydinlatma-2026.08.01.md
└── kvkk-acik-riza-2026.08.01.md
```

- The active version of each document is the single source of truth in
  `lib/legal/config.ts` (`LEGAL_VERSIONS`). Never hardcode legal versions
  elsewhere.
- When a legal text changes, add a new versioned file and bump the key in
  `lib/legal/config.ts`. Previous versions stay for auditability.
- See `legal/README.md` for the convention. No legal text has been written yet.

## Project structure

```
app/
├── (website)/        # public corporate site
├── on-kayit/[slug]/  # public QR pre-registration entry
├── admin/            # admin panel
└── (api routes later)

components/
├── ui/ website/ forms/ admin/   # created when features land

lib/
├── db.ts        # Prisma client (server-only)
├── auth.ts      # admin auth seam (server-only)
├── resend.ts    # Resend foundation
├── qr.ts        # QR generation foundation
├── ip.ts        # client IP resolver (Vercel x-forwarded-for)
├── validation/  # shared Zod schemas
└── legal/       # legal version config

prisma/
├── schema.prisma  # minimal: generator + datasource only
└── generated/     # git-ignored Prisma client

legal/           # versioned legal documents
emails/          # email templates (later)
styles/          # design tokens + global styles (Vanilla Extract)
public/
docs/
```

## Out of scope (later phases)

School CRUD, QR flow, OnKayit/Consent models, Resend notifications, Unified
Requests, admin dashboard, CMS, authentication UI/RBAC, WhatsApp API, queues,
and background workers are **not** part of the bootstrap.
