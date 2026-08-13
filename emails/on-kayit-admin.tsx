// Company notification email for a new OnKayit (school-service pre-registration).
//
// IMPORTANT (privacy): the full TC Kimlik number is NEVER included. When a
// school requires TC, only a masked/last-four representation may be passed in.
// This component receives already-masked data — do not add the full value here.

import * as React from "react";

type AdminEmailProps = {
  okulAd: string;
  ogrenciAd: string;
  ogrenciSoyad: string;
  sinifKademe: string;
  veliAdSoyad: string;
  telefon: string;
  eposta?: string | null;
  adres: string;
  tcKimlikMasked?: string | null;
  status: string;
  createdAt: string;
};

export function OnKayitAdminEmail(props: AdminEmailProps) {
  const row = (label: string, value: string) => (
    <div style={{ margin: "4px 0" }}>
      <strong>{label}:</strong> {value}
    </div>
  );

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#111", lineHeight: 1.5 }}>
      <h2 style={{ fontSize: "18px" }}>Yeni Ön Kayıt Talebi</h2>
      {row("Okul", props.okulAd)}
      {row("Öğrenci", `${props.ogrenciAd} ${props.ogrenciSoyad}`)}
      {row("Sınıf/Kademe", props.sinifKademe)}
      {props.tcKimlikMasked ? row("TC Kimlik (maskeli)", props.tcKimlikMasked) : null}
      {row("Veli", props.veliAdSoyad)}
      {row("Telefon", props.telefon)}
      {props.eposta ? row("E-posta", props.eposta) : null}
      {row("Adres", props.adres)}
      {row("Durum", props.status)}
      {row("Tarih", props.createdAt)}
      <p style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
        Bu otomatik bir bildirimdir. TC Kimlik numarasının tamamı e-postaya dahil
        edilmez.
      </p>
    </div>
  );
}
