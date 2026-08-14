// Public references page

import { listActiveReferences } from "@/lib/cms";
import { Metadata } from "next";
import * as s from "@/components/cms/website-cms.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Referanslar",
  description: "Serhan Turizm'in güvendiği referanslar",
};

export default async function ReferanslarPage() {
  const references = await listActiveReferences();

  return (
    <main className={s.main}>
      <h1 className={s.headline}>Referanslar</h1>
      <p>Serhan Turizm&apos;in güvendiği referanslar</p>

      {references.length === 0 ? (
        <p>Henüz referans bulunmamaktadır.</p>
      ) : (
        <div className={s.grid}>
          {references.map((ref) => (
            <div key={ref.id} className={s.refCard}>
              {ref.logoUrl && (
                <img
                  src={ref.logoUrl}
                  alt={ref.name}
                  className={s.refLogo}
                />
              )}
              <h3>{ref.name}</h3>
              {ref.description && <p>{ref.description}</p>}
              {ref.websiteUrl && (
                <a href={ref.websiteUrl} target="_blank" rel="noopener noreferrer" className={s.refLink}>
                  Web Sitesi
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
