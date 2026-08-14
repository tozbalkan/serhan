// Public service detail

import { notFound } from "next/navigation";
import { getActiveServiceBySlug } from "@/lib/cms";
import { Metadata } from "next";
import * as s from "@/components/cms/website-cms.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getActiveServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.shortDescription || "",
  };
}

export default async function HizmetPage({ params }: Props) {
  const { slug } = await params;
  const service = await getActiveServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className={s.main}>
      <h1 className={s.headline}>{service.name}</h1>
      {service.shortDescription && <p>{service.shortDescription}</p>}
      {service.imageUrl && (
        <img src={service.imageUrl} alt={service.name} className={s.coverImage} />
      )}
      <article className={s.article}>
        {service.content}
      </article>
    </main>
  );
}
