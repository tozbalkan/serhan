// Parent confirmation email for a received OnKayit (school-service pre-registration).
//
// Confirms receipt only. No TC data, no address detail, no sensitive fields.

import * as React from "react";

type ConfirmationEmailProps = {
  okulAd: string;
  ogrenciAd: string;
  veliAdSoyad: string;
};

export function OnKayitConfirmationEmail(props: ConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#111", lineHeight: 1.5 }}>
      <h2 style={{ fontSize: "18px" }}>Ön Kayıt Talebiniz Alınmıştır</h2>
      <p>Sayın {props.veliAdSoyad},</p>
      <p>
        {props.okulAd} okulu için {props.ogrenciAd} adlı öğrenciye ait ön kayıt
        talebiniz alınmıştır. Talebiniz incelendikten sonra sizinle iletişime
        geçilecektir.
      </p>
      <p style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
        Bu otomatik bir bilgilendirme e-postasıdır.
      </p>
    </div>
  );
}
