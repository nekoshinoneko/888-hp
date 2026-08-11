import { redirect } from "next/navigation";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { getSessionUser } from "@/lib/auth/session";
import { listAuthors } from "@/lib/cms/repository";
import { EMPTY_DOC, type Article } from "@/lib/cms/schema";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const authors = await listAuthors();

  const blank: Article = {
    slug: "",
    title: "",
    excerpt: "",
    eyecatch: null,
    category: "tech",
    tags: [],
    hashtags: [],
    // 書いている本人を最初から著者に入れておく
    authorIds: [user.author.id],
    body: EMPTY_DOC,
    publishedAt: null,
    updatedAt: new Date(),
    createdAt: new Date(),
    status: "draft",
  };

  return <ArticleForm initial={blank} authors={authors} isNew />;
}
