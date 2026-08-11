import "server-only";

/**
 * 記事と著者の読み書き。Firestore に触るのはこのファイルだけにする。
 * ページやフォームから直接 Firestore を叩かない（指示書「絶対に守ること > 実装」）。
 * プロジェクト構成が変わったときの影響範囲をここに閉じ込めるのが目的。
 */

import { Timestamp } from "firebase-admin/firestore";

import {
  COLLECTIONS,
  type Article,
  type ArticleStatus,
  type Author,
} from "@/lib/cms/schema";
import { adminDb } from "@/lib/firebase/admin";

/* ---------------- 変換 ---------------- */

type Unknown = Record<string, unknown>;

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function toArticle(id: string, data: Unknown): Article {
  return {
    slug: id,
    title: (data.title as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    eyecatch: (data.eyecatch as Article["eyecatch"]) ?? null,
    category: (data.category as Article["category"]) ?? "tech",
    tags: (data.tags as string[]) ?? [],
    hashtags: (data.hashtags as string[]) ?? [],
    authorIds: (data.authorIds as string[]) ?? [],
    body: (data.body as string) ?? "",
    publishedAt: toDate(data.publishedAt),
    updatedAt: toDate(data.updatedAt) ?? new Date(0),
    createdAt: toDate(data.createdAt) ?? new Date(0),
    status: (data.status as ArticleStatus) ?? "draft",
  };
}

function toAuthor(id: string, data: Unknown): Author {
  return {
    id,
    displayName: (data.displayName as string) ?? "",
    avatarUrl: (data.avatarUrl as string) || undefined,
    role: (data.role as string) ?? "",
    bio: (data.bio as string) ?? "",
    links: (data.links as Author["links"]) ?? {},
    isMember: Boolean(data.isMember),
    email: (data.email as string) ?? "",
  };
}

/* ---------------- 記事 ---------------- */

export async function listArticles(): Promise<Article[]> {
  const snap = await adminDb()
    .collection(COLLECTIONS.articles)
    .orderBy("updatedAt", "desc")
    .get();
  return snap.docs.map((d) => toArticle(d.id, d.data()));
}

export async function getArticle(slug: string): Promise<Article | null> {
  const doc = await adminDb().collection(COLLECTIONS.articles).doc(slug).get();
  return doc.exists ? toArticle(doc.id, doc.data() as Unknown) : null;
}

/**
 * 記事を保存する。slug がドキュメントIDなので、slug の変更は
 * 「新しいIDで作って古いのを消す」になる。URLが変わる操作なので呼び出し側で確認を取る。
 */
export async function saveArticle(
  article: Article,
  options: { previousSlug?: string } = {},
): Promise<void> {
  const db = adminDb();
  const ref = db.collection(COLLECTIONS.articles).doc(article.slug);

  const payload = {
    title: article.title,
    excerpt: article.excerpt,
    eyecatch: article.eyecatch,
    category: article.category,
    tags: article.tags,
    hashtags: article.hashtags,
    authorIds: article.authorIds,
    body: article.body,
    publishedAt: article.publishedAt
      ? Timestamp.fromDate(article.publishedAt)
      : null,
    // 最終更新日は保存のたびに動く。公開日とは別に持つ（REQ-04・05）
    updatedAt: Timestamp.fromDate(new Date()),
    createdAt: Timestamp.fromDate(article.createdAt),
    status: article.status,
  };

  const previous = options.previousSlug;
  if (previous && previous !== article.slug) {
    const batch = db.batch();
    batch.set(ref, payload);
    batch.delete(db.collection(COLLECTIONS.articles).doc(previous));
    await batch.commit();
    return;
  }

  await ref.set(payload, { merge: true });
}

export async function deleteArticle(slug: string): Promise<void> {
  await adminDb().collection(COLLECTIONS.articles).doc(slug).delete();
}

export async function slugExists(slug: string): Promise<boolean> {
  const doc = await adminDb().collection(COLLECTIONS.articles).doc(slug).get();
  return doc.exists;
}

/* ---------------- 著者（社員マスタ） ---------------- */

export async function listAuthors(): Promise<Author[]> {
  const snap = await adminDb()
    .collection(COLLECTIONS.authors)
    .orderBy("displayName")
    .get();
  return snap.docs.map((d) => toAuthor(d.id, d.data()));
}

export async function getAuthorByEmail(email: string): Promise<Author | null> {
  const snap = await adminDb()
    .collection(COLLECTIONS.authors)
    .where("email", "==", email.toLowerCase())
    .limit(1)
    .get();
  const doc = snap.docs[0];
  return doc ? toAuthor(doc.id, doc.data()) : null;
}

export async function saveAuthor(author: Author): Promise<void> {
  await adminDb()
    .collection(COLLECTIONS.authors)
    .doc(author.id)
    .set(
      {
        displayName: author.displayName,
        avatarUrl: author.avatarUrl ?? null,
        role: author.role,
        bio: author.bio,
        links: author.links,
        isMember: author.isMember,
        email: author.email.toLowerCase(),
      },
      { merge: true },
    );
}

/**
 * 初回ログイン時に著者レコードを用意する。
 * Google の表示名・写真はあくまで初期値で、あとから著者マスタ側で上書きできる（要件 6.6）。
 * すでにレコードがあれば何もしない。上書きしてしまうと手で直した内容が消えるため。
 */
export async function ensureAuthorForLogin(params: {
  email: string;
  displayName: string;
  photoUrl?: string;
}): Promise<Author> {
  const existing = await getAuthorByEmail(params.email);
  if (existing) return existing;

  const id = params.email.split("@")[0]!.replace(/[^a-z0-9-]/gi, "-");
  const author: Author = {
    id,
    displayName: params.displayName || params.email,
    // [要確認] 要件6.6：Googleの画像は直リンクだと不安定なので、
    // 本来は初回ログイン時に自社ストレージへコピーする。いまはURLのまま持っている。
    avatarUrl: params.photoUrl,
    role: "",
    bio: "",
    links: {},
    isMember: false,
    email: params.email.toLowerCase(),
  };
  await saveAuthor(author);
  return author;
}
