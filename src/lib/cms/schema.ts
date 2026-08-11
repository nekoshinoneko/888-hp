/**
 * オウンドメディアのデータモデル。
 * 指示書 4.8 のスキーマをそのまま型にしたもの。項目を勝手に増やさない。
 *
 * author は「社員マスタ」を兼ねる（指示書 4.3）。
 * メンバー紹介ページ・代表紹介・記事の著者表示がすべてこれを参照する。
 * 分けて作ると二重管理になり必ず破綻する、と要件で明示されている。
 */

export const CATEGORY_IDS = ["tech", "report", "news"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export const ARTICLE_STATUSES = ["draft", "scheduled", "published"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export type Category = {
  id: CategoryId;
  label: string;
  /** タグの色。CSS側の .post__tag--{id} と対応させる */
  colorToken: string;
};

export const CATEGORIES: Record<CategoryId, Category> = {
  tech: { id: "tech", label: "テックブログ", colorToken: "accent-soft" },
  report: { id: "report", label: "イベントレポート", colorToken: "report" },
  news: { id: "news", label: "お知らせ", colorToken: "news" },
};

/** アイキャッチ。必須項目で、未設定なら公開できない（要件 6.3） */
export type Eyecatch = {
  /** Cloud Storage の公開URL */
  url: string;
  /** Storage 上のパス。差し替え・削除に使う */
  path: string;
  alt: string;
  width: number;
  height: number;
};

export type AuthorLinks = {
  x?: string;
  github?: string;
  website?: string;
};

export type Author = {
  id: string;
  displayName: string;
  /** アイコン画像のURL。未設定ならイニシャルにフォールバックする（要件 6.6） */
  avatarUrl?: string;
  /** 役職・所属 */
  role: string;
  bio: string;
  links: AuthorLinks;
  /** メンバー紹介ページに出すか */
  isMember: boolean;
  /**
   * ログインに使う Google アカウントのメールアドレス。
   * Firebase Auth の uid ではなくメールで紐付ける。
   * 先に著者レコードを作っておき、本人が初回ログインした時点で結びつくようにするため。
   */
  email: string;
};

export type Article = {
  /** 一意。メディア側の /[slug] になる */
  slug: string;
  title: string;
  excerpt: string;
  eyecatch: Eyecatch | null;
  category: CategoryId;
  tags: string[];
  /** Xシェア用（要件 6.4）。記事ごとに指定できる */
  hashtags: string[];
  /** 複数可（共著対応・REQ-06/07）。author.id の配列 */
  authorIds: string[];
  /** Markdown */
  body: string;
  /**
   * 公開日。予約投稿のときは未来の日時が入る。
   * updatedAt とは別に保持する（REQ-04・05）。
   */
  publishedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  status: ArticleStatus;
};

/** Firestore に入る形。Date は Timestamp になるので入出力で変換する */
export type ArticleDoc = Omit<
  Article,
  "publishedAt" | "updatedAt" | "createdAt"
> & {
  publishedAt: FirestoreTimestampLike | null;
  updatedAt: FirestoreTimestampLike;
  createdAt: FirestoreTimestampLike;
};

/** client SDK と admin SDK の Timestamp の共通部分だけを見る */
export type FirestoreTimestampLike = { toDate(): Date };

export const COLLECTIONS = {
  articles: "articles",
  authors: "authors",
  /** いいねのカウント（指示書 5.2）。実装順序6で使う */
  likes: "likes",
} as const;

/**
 * 公開できる状態かを判定する。
 * アイキャッチが必須なのは要件 6.3。ここを緩めると OGP 画像が出ない記事が公開される。
 */
export function validateForPublish(article: Article): string[] {
  const errors: string[] = [];

  if (!article.slug.trim()) errors.push("スラッグが空です");
  if (!/^[a-z0-9-]+$/.test(article.slug))
    errors.push("スラッグは英小文字・数字・ハイフンだけで書いてください");
  if (!article.title.trim()) errors.push("タイトルが空です");
  if (!article.excerpt.trim())
    errors.push("抜粋が空です（一覧とOGPの説明文に使います）");
  if (!article.eyecatch)
    errors.push("アイキャッチが未設定です（必須。OGP画像にも使います）");
  if (article.eyecatch && !article.eyecatch.alt.trim())
    errors.push("アイキャッチの代替テキストが空です");
  if (article.authorIds.length === 0) errors.push("著者が未設定です");
  if (!article.body.trim()) errors.push("本文が空です");
  if (article.status === "scheduled" && !article.publishedAt)
    errors.push("予約投稿なのに公開日時が入っていません");

  return errors;
}

/**
 * 読者に見せてよい記事か。
 * status が published でも publishedAt が未来なら出さない（予約投稿の取りこぼし防止）。
 */
export function isVisibleToPublic(article: Article, now = new Date()): boolean {
  if (article.status !== "published") return false;
  if (!article.publishedAt) return false;
  return article.publishedAt.getTime() <= now.getTime();
}
