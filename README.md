# Serhan Turizm

Kurumsal web sitesi ve hafif yönetim paneli. Basit, hızlı, amaç odaklı bir
modüler monolit (Next.js + PostgreSQL + Prisma).

## Teknoloji

- Next.js (App Router) + React + TypeScript (strict)
- Vanilla Extract (token tabanlı tasarım sistemi)
- PostgreSQL + Prisma
- Zod (doğrulama)
- Resend (e-posta)
- `qrcode` (QR üretimi)
- Vercel (dağıtım)

## Başlangıç

```bash
npm install
cp .env.example .env   # ardından DATABASE_URL vb. değerleri doldur
npx prisma generate    # Prisma client üret (prisma/generated)
npm run dev
```

## Komutlar

```bash
npm run dev        # geliştirme sunucusu
npm run build      # üretim derlemesi
npm run start      # üretim sunucusu
npm run lint       # ESLint
npm run typecheck  # TypeScript kontrolü
npx prisma generate  # Prisma client yeniden üret
```

## Yapı

- `app/` — `(website)`, `on-kayit/[slug]`, `admin` rotaları
- `components/` — `ui/`, `website/`, `forms/`, `admin/`
- `lib/` — `db`, `auth`, `resend`, `qr`, `ip`, `validation`, `legal`
- `prisma/` — `schema.prisma` (şimdilik minimal) + üretilen client
- `styles/` — tasarım tokenları (HSL) ve global stiller
- `legal/` — sürümlemeyle tutulan yasal belgeler
- `docs/` — `architecture.md`, `frontend-rules.md` (kalıcı kurallar)

## Önemli kurallar

Ön yüz kuralları için `docs/frontend-rules.md`, mimari için
`docs/architecture.md` dosyasına bakın. Bu kurallar kalıcıdır; her kod
değişikliği öncesinde okunmalıdır.

> Bu depo yalnızca **bootstrap** aşamasındadır. Alan özellikleri (okul CRUD,
> QR akışı, ön kayıt, onay, CMS, kimlik doğrulama UI) sonraki aşamalarda eklenir.
