// Public blog list page

import Link from "next/link";
import { listPublishedBlogPosts } from "@/lib/cms";
import { Metadata } from "next";
import * as s from "@/components/cms/website-cms.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Serhan Turizm'den güncel haberler ve duyurular",
};

export default async function BlogPage() {
  const posts = await listPublishedBlogPosts();

  return (
    <main className={s.main}>
      <h1 className={s.headline}>Blog</h1>
      <p>Serhan Turizm&apos;den güncel haberler ve duyurular</p>

      {posts.length === 0 ? (
        <p>Henüz yazı bulunmamaktadır.</p>
      ) : (
        <div className={s.listBlock}>
          {posts.map((post) => (
            <article key={post.id} className={s.blogItem}>
              <h2>
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && <p>{post.excerpt}</p>}
              {post.publishedAt && (
                <p className={s.metaText}>
                  {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
                </p>
              )}
              <Link href={`/blog/${post.slug}`} className={s.refLink}>
                Devamını oku →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
