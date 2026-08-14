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

## CRM Foundation (Phase 6)

A minimal customer relationship model allows Serhan Turizm to recognize
returning parents and children across pre-registration submissions over several
years, without building a full CRM product.

### Core entities

- **Musteri** (Customer/Parent): Persistent identity, matched by phone (primary)
  or email (secondary). Contains only name, phone, email. No TC, no verification
  results.
- **Ogrenci** (Student): Persistent identity within a customer and school.
  Matched by first name + last name + school. Class can be updated when a
  student is re-matched (progression tracking).
- **OnKayit** (Pre-registration submission): Historical snapshot. Preserves all
  original submitted data. Never overwritten. References current Musteri and
  Ogrenci for CRM linkage.
- **Consent**: Tied to specific OnKayit. Represents the legal state at
  submission time. One Consent per OnKayit.

### Matching strategy

Conservative and deterministic:

- **Customer matching**: Phone → Email → Create new. No fuzzy matching.
- **Student matching**: (customer + school + first name + last name) → Update
  class if changed → Create new. Case-insensitive. No automatic merging.

### Historical data preservation

- All OnKayit fields remain unchanged after submission.
- OnKayit.sinifKademe (submitted class) never changes, even if the student
  progresses.
- Current Ogrenci.sinifKademe tracks the latest known class.
- Two submissions one year apart:
  - Same Musteri (if phone/email match).
  - Same Ogrenci (if name + school match).
  - Different OnKayit (new submission).
  - OnKayit fields show original class; Ogrenci shows current class.

### Privacy and data minimization

- TC Kimlik storage rules unchanged: last 4 digits in OnKayit only (when school
  requires).
- Full TC never stored anywhere, including CRM records.
- Musteri stores only operational contact data: name, phone, email.
- No identity verification results, no browser fingerprints, no device IDs.

### Admin interface

Minimal customer search and summary:

- `/admin/musteriler` — Search customers by name/phone/email.
- `/admin/musteriler/[id]` — Customer detail: name, phone, students, request
  history.
- OnKayit detail page links to customer when available.
- No customer dashboard, no segmentation, no marketing automation.

## Future domain boundaries

The Prisma domain will later include (not yet implemented):

- Additional CRM operations (customer notes, relationship history)
- Segmentation and analytics
- Marketing automation
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
