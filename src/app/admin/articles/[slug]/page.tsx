import { notFound, redirect } from "next/navigation";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { getSessionUser } from "@/lib/auth/session";
import { getArticle, listAuthors } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { slug } = await params;
  const [article, authors] = await Promise.all([
    getArticle(slug),
    listAuthors(),
  ]);

  if (!article) notFound();

  return <ArticleForm initial={article} authors={authors} isNew={false} />;
}
