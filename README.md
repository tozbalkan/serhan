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
cp .env.example .env   # ardından DATABASE_URL, NEXT_PUBLIC_APP_URL vb. değerleri doldur
npx prisma generate    # Prisma client üret (prisma/generated)
npm run dev
```

> Not: `NEXT_PUBLIC_APP_URL`, QR kodlarının işaret ettiği kalıcı herkese açık
> URL'nin tek kaynağıdır. Yerel geliştirmede `http://localhost:3000`, Vercel'de
> üretim adresi (`https://serhanturizm.com`) olmalıdır.

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

- `app/` — `(website)`, `on-kayit/[slug]` (herkese açık okul girişi), `admin/okullar` (okul yönetimi), `api/admin/okullar/[id]/qr` (QR üretimi)
- `components/` — `admin/` (okul tablosu, QR indirme, durum değiştirme, oluşturma formu)
- `lib/` — `db`, `auth`, `resend`, `qr`, `ip`, `validation`, `legal`, `slug`, `schools`
- `prisma/` — `schema.prisma` (tam domain modeli) + üretilen client + migration
- `styles/` — tasarım tokenları (HSL) ve global stiller
- `legal/` — sürümlemeyle tutulan yasal belgeler
- `docs/` — `architecture.md`, `frontend-rules.md` (kalıcı kurallar)

## Önemli kurallar

Ön yüz kuralları için `docs/frontend-rules.md`, mimari için
`docs/architecture.md` dosyasına bakın. Bu kurallar kalıcıdır; her kod
değişikliği öncesinde okunmalıdır.

> **Aşamalar:** Bootstrap ✅ · Domain şeması + migration ✅ · Okul yönetimi + QR
> + herkese açık okul girişi ✅. Sıradaki: ön kayıt formu, onay (KVKK), Resend
> bildirimleri, birleşik talepler, kimlik doğrulama UI, CMS.
