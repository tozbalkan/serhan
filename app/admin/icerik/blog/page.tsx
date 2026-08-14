// Admin blog list

import { requireAdminSession } from "@/lib/auth";
import Link from "next/link";
import { listBlogPostsForAdmin } from "@/lib/admin/blog";
import * as s from "@/components/cms/admin-cms.css";

export default async function BlogPage() {
  await requireAdminSession();
  const posts = await listBlogPostsForAdmin();

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <h1>Blog Yazıları</h1>
        <Link href="/admin/icerik/blog/yeni">
          <button>Yeni Yazı</button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <p>Henüz yazı eklenmemiştir.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr className={s.rowSeparator}>
              <th className={s.th}>Başlık</th>
              <th className={s.th}>Slug</th>
              <th className={s.th}>Durum</th>
              <th className={s.th}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className={s.rowSeparator}>
                <td className={s.td}>{post.title}</td>
                <td className={s.td}>{post.slug}</td>
                <td className={s.td}>{post.status}</td>
                <td className={s.td}>
                  <Link href={`/admin/icerik/blog/${post.id}`}>
                    <button>Düzenle</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
