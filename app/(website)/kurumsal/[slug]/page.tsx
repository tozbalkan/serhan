// Public corporate page detail

import { notFound } from "next/navigation";
import { getPublishedPageBySlug } from "@/lib/cms";
import { Metadata } from "next";
import * as s from "@/components/cms/website-cms.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt || "",
  };
}

export default async function KurumsalPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className={s.main}>
      <h1 className={s.headline}>{page.title}</h1>
      {page.excerpt && <p>{page.excerpt}</p>}
      <article className={s.article}>
        {page.content}
      </article>
    </main>
  );
}
