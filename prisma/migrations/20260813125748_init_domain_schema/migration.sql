-- CreateEnum
CREATE TYPE "TalepDurumu" AS ENUM ('YENI', 'INCELENIYOR', 'ILETISIME_GECILDI', 'TAMAMLANDI');

-- CreateTable
CREATE TABLE "Okul" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "tcKimlikIster" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Okul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnKayit" (
    "id" TEXT NOT NULL,
    "okulId" TEXT NOT NULL,
    "ogrenciAd" TEXT NOT NULL,
    "ogrenciSoyad" TEXT NOT NULL,
    "sinifKademe" TEXT NOT NULL,
    "tcKimlikNo" TEXT,
    "adres" TEXT NOT NULL,
    "veliAdSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "eposta" TEXT,
    "status" "TalepDurumu" NOT NULL DEFAULT 'YENI',
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnKayit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "onKayitId" TEXT NOT NULL,
    "privacyNoticeVersion" TEXT NOT NULL,
    "privacyAcknowledgedAt" TIMESTAMP(3) NOT NULL,
    "explicitConsent" BOOLEAN NOT NULL,
    "explicitConsentAt" TIMESTAMP(3),
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "marketingConsentAt" TIMESTAMP(3),
    "ipAddress" TEXT NOT NULL,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teklif" (
    "id" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "eposta" TEXT NOT NULL,
    "mesaj" TEXT NOT NULL,
    "status" "TalepDurumu" NOT NULL DEFAULT 'YENI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teklif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IsBasvuru" (
    "id" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "eposta" TEXT NOT NULL,
    "mesaj" TEXT NOT NULL,
    "status" "TalepDurumu" NOT NULL DEFAULT 'YENI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IsBasvuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Iletisim" (
    "id" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "eposta" TEXT NOT NULL,
    "mesaj" TEXT NOT NULL,
    "status" "TalepDurumu" NOT NULL DEFAULT 'YENI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Iletisim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AracGeriBildirim" (
    "id" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "eposta" TEXT NOT NULL,
    "mesaj" TEXT NOT NULL,
    "status" "TalepDurumu" NOT NULL DEFAULT 'YENI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AracGeriBildirim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Okul_slug_key" ON "Okul"("slug");

-- CreateIndex
CREATE INDEX "Okul_aktif_idx" ON "Okul"("aktif");

-- CreateIndex
CREATE INDEX "OnKayit_okulId_idx" ON "OnKayit"("okulId");

-- CreateIndex
CREATE INDEX "OnKayit_createdAt_idx" ON "OnKayit"("createdAt");

-- CreateIndex
CREATE INDEX "OnKayit_status_idx" ON "OnKayit"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Consent_onKayitId_key" ON "Consent"("onKayitId");

-- CreateIndex
CREATE INDEX "Teklif_createdAt_idx" ON "Teklif"("createdAt");

-- CreateIndex
CREATE INDEX "Teklif_status_idx" ON "Teklif"("status");

-- CreateIndex
CREATE INDEX "IsBasvuru_createdAt_idx" ON "IsBasvuru"("createdAt");

-- CreateIndex
CREATE INDEX "IsBasvuru_status_idx" ON "IsBasvuru"("status");

-- CreateIndex
CREATE INDEX "Iletisim_createdAt_idx" ON "Iletisim"("createdAt");

-- CreateIndex
CREATE INDEX "Iletisim_status_idx" ON "Iletisim"("status");

-- CreateIndex
CREATE INDEX "AracGeriBildirim_createdAt_idx" ON "AracGeriBildirim"("createdAt");

-- CreateIndex
CREATE INDEX "AracGeriBildirim_status_idx" ON "AracGeriBildirim"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "OnKayit" ADD CONSTRAINT "OnKayit_okulId_fkey" FOREIGN KEY ("okulId") REFERENCES "Okul"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_onKayitId_fkey" FOREIGN KEY ("onKayitId") REFERENCES "OnKayit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
