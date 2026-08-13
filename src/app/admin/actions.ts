"use server";

/**
 * /admin から呼ぶサーバー処理。
 * 認証チェックは各アクションの先頭で必ず行う。
 * 「画面に出ていないから安全」は成立しない（アクションは直接叩ける）。
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { destroySession, getSessionUser } from "@/lib/auth/session";
import {
  deleteArticle,
  getArticle,
  saveArticle,
  saveAuthor,
  slugExists,
} from "@/lib/cms/repository";
import {
  EMPTY_DOC,
  validateForPublish,
  type Article,
  type ArticleStatus,
  type CategoryId,
  type Eyecatch,
  type RichTextDoc,
} from "@/lib/cms/schema";

export type ActionResult = { ok: true } | { ok: false; errors: string[] };

// ログインの発行は /api/admin/session（Route Handler）が持つ。
// IDトークンとCookieの交換は素のHTTPの方が扱いやすいため。

export async function signOut(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export type ArticleInput = {
  slug: string;
  previousSlug?: string;
  title: string;
  excerpt: string;
  eyecatch: Eyecatch | null;
  category: CategoryId;
  tags: string[];
  hashtags: string[];
  authorIds: string[];
  body: RichTextDoc;
  status: ArticleStatus;
  /** ISO文字列。予約投稿のときは未来日時 */
  publishedAt: string | null;
};

export async function saveArticleAction(
  input: ArticleInput,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, errors: ["ログインが切れています"] };

  const existing = input.previousSlug
    ? await getArticle(input.previousSlug)
    : null;

  // slug を変えた／新規なのに既存とぶつかる場合は止める。URLの衝突は事故になる
  if (input.slug !== input.previousSlug && (await slugExists(input.slug))) {
    return {
      ok: false,
      errors: [`スラッグ「${input.slug}」はすでに使われています`],
    };
  }

  const article: Article = {
    slug: input.slug.trim(),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    eyecatch: input.eyecatch,
    category: input.category,
    tags: input.tags,
    hashtags: input.hashtags,
    authorIds: input.authorIds,
    body: input.body ?? EMPTY_DOC,
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
    updatedAt: new Date(),
    createdAt: existing?.createdAt ?? new Date(),
    status: input.status,
  };

  // 下書きは途中でも保存できる。公開・予約のときだけ全項目を見る（要件6.3）
  if (article.status !== "draft") {
    const errors = validateForPublish(article);
    if (errors.length) return { ok: false, errors };
  }

  // 公開に切り替えた瞬間に公開日が無ければ、そのときの日時を入れる。
  // 一度入った公開日は保存のたびに動かさない（更新日とは別物・REQ-04/05）
  if (article.status === "published" && !article.publishedAt) {
    article.publishedAt = new Date();
  }

  await saveArticle(article, { previousSlug: input.previousSlug });

  revalidatePath("/admin");
  revalidatePath(`/admin/articles/${article.slug}`);
  return { ok: true };
}

export async function deleteArticleAction(slug: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, errors: ["ログインが切れています"] };

  await deleteArticle(slug);
  revalidatePath("/admin");
  return { ok: true };
}

export type AuthorInput = {
  id: string;
  displayName: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  links: { x?: string; github?: string; website?: string };
  isMember: boolean;
  email: string;
};

export async function saveAuthorAction(
  input: AuthorInput,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, errors: ["ログインが切れています"] };

  if (!input.displayName.trim()) {
    return { ok: false, errors: ["表示名が空です"] };
  }

  await saveAuthor({
    id: input.id,
    displayName: input.displayName.trim(),
    role: input.role.trim(),
    bio: input.bio.trim(),
    avatarUrl: input.avatarUrl,
    links: input.links,
    isMember: input.isMember,
    email: input.email,
  });

  revalidatePath("/admin/authors");
  return { ok: true };
}
