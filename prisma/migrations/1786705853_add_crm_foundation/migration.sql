-- CreateTable Musteri (Customer / Parent)
CREATE TABLE "Musteri" (
    "id" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "eposta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Musteri_pkey" PRIMARY KEY ("id")
);

-- CreateTable Ogrenci (Student)
CREATE TABLE "Ogrenci" (
    "id" TEXT NOT NULL,
    "musteriId" TEXT NOT NULL,
    "okulId" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "sinifKademe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ogrenci_pkey" PRIMARY KEY ("id")
);

-- Add new columns to OnKayit
ALTER TABLE "OnKayit" ADD COLUMN "musteriId" TEXT,
ADD COLUMN "ogrenciId" TEXT;

-- CreateIndex for Musteri
CREATE UNIQUE INDEX "Musteri_telefon_key" ON "Musteri"("telefon");
CREATE INDEX "Musteri_eposta_idx" ON "Musteri"("eposta");

-- CreateIndex for Ogrenci
CREATE INDEX "Ogrenci_musteriId_idx" ON "Ogrenci"("musteriId");
CREATE INDEX "Ogrenci_okulId_idx" ON "Ogrenci"("okulId");
CREATE UNIQUE INDEX "Ogrenci_musteriId_ad_soyad_okulId_key" ON "Ogrenci"("musteriId", "ad", "soyad", "okulId");

-- CreateIndex for OnKayit (new columns)
CREATE INDEX "OnKayit_musteriId_idx" ON "OnKayit"("musteriId");
CREATE INDEX "OnKayit_ogrenciId_idx" ON "OnKayit"("ogrenciId");

-- AddForeignKey (OnKayit -> Musteri)
ALTER TABLE "OnKayit" ADD CONSTRAINT "OnKayit_musteriId_fkey" FOREIGN KEY ("musteriId") REFERENCES "Musteri"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey (OnKayit -> Ogrenci)
ALTER TABLE "OnKayit" ADD CONSTRAINT "OnKayit_ogrenciId_fkey" FOREIGN KEY ("ogrenciId") REFERENCES "Ogrenci"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey (Ogrenci -> Musteri)
ALTER TABLE "Ogrenci" ADD CONSTRAINT "Ogrenci_musteriId_fkey" FOREIGN KEY ("musteriId") REFERENCES "Musteri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey (Ogrenci -> Okul)
ALTER TABLE "Ogrenci" ADD CONSTRAINT "Ogrenci_okulId_fkey" FOREIGN KEY ("okulId") REFERENCES "Okul"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
