// Public blog detail page

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBlogPostBySlug } from "@/lib/cms";
import { Metadata } from "next";
import * as s from "@/components/cms/website-cms.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={s.main}>
      <Link href="/blog" className={s.backLink}>← Geri Dön</Link>

      <h1 className={s.headline}>{post.title}</h1>

      {post.publishedAt && (
        <p className={s.metaText}>
          {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className={s.coverImage}
        />
      )}

      {post.excerpt && <p className={s.excerpt}>{post.excerpt}</p>}

      <article className={s.article}>
        {post.content}
      </article>

      <Link href="/blog" className={s.backLink}>← Geri Dön</Link>
    </main>
  );
}
