import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { listArticles, listAuthors } from "@/lib/cms/repository";
import { CATEGORIES, type ArticleStatus } from "@/lib/cms/schema";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: "下書き",
  scheduled: "予約",
  published: "公開",
};

export default async function AdminArticlesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [articles, authors] = await Promise.all([
    listArticles(),
    listAuthors(),
  ]);
  const authorName = new Map(authors.map((a) => [a.id, a.displayName]));

  return (
    <>
      <div className="admin__pageHead">
        <h1>記事</h1>
        <Link className="btn" href="/admin/articles/new">
          新しい記事
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="admin__empty">
          まだ記事がありません。「新しい記事」から作成してください。
        </p>
      ) : (
        <table className="admin__table">
          <thead>
            <tr>
              <th>タイトル</th>
              <th>カテゴリ</th>
              <th>状態</th>
              <th>公開日</th>
              <th>最終更新</th>
              <th>著者</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.slug}>
                <td>
                  <Link href={`/admin/articles/${article.slug}`}>
                    {article.title || "（無題）"}
                  </Link>
                  <span className="admin__slug">/{article.slug}</span>
                </td>
                <td>{CATEGORIES[article.category].label}</td>
                <td>
                  <span className={`admin__status is-${article.status}`}>
                    {STATUS_LABEL[article.status]}
                  </span>
                </td>
                <td>{formatDate(article.publishedAt)}</td>
                <td>{formatDate(article.updatedAt)}</td>
                <td>
                  {article.authorIds
                    .map((id) => authorName.get(id) ?? id)
                    .join("、") || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function formatDate(date: Date | null): string {
  if (!date || date.getTime() === 0) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
