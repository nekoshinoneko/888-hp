import { mediaUrl } from "@/content/site";

export type PostCategory = "tech" | "report" | "news";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: PostCategory;
  /** アイキャッチ。実装順序4で執筆者がCMSからアップロードした画像に差し替える */
  thumb: string;
  thumbAlt: string;
  author: string;
};

export const categories: { id: "all" | PostCategory; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "tech", label: "テックブログ" },
  { id: "report", label: "イベントレポート" },
  { id: "news", label: "お知らせ" },
];

export const categoryLabel: Record<PostCategory, string> = {
  tech: "テックブログ",
  report: "イベントレポート",
  news: "お知らせ",
};

/**
 * ===== 仮データ =====
 * docs/prototype.html に置かれていた見本の記事をそのまま移したもの。
 * 実在の記事ではない。
 *
 * [要確認] 未確定#12：公開時の初回記事3本の内容（篠原＋執筆担当）
 * 実装順序4でCMSから取得する形に置き換える。それまでの見た目確認用。
 * アイキャッチも仮（public/assets/thumbs/）。CMSの画像に差し替える。
 */
export const placeholderPosts: Post[] = [
  {
    slug: "demostage-in-summer-report",
    title: "DemoStage in Summer 開催レポート",
    excerpt:
      "学生エンジニアが自作プロダクトを持ち寄る展示イベントを大阪で開催しました。当日の様子と、運営して分かったことをまとめています。",
    date: "2026.08.05",
    category: "report",
    thumb: "/assets/thumbs/thumb-1.svg",
    thumbAlt: "",
    author: "篠原 晴哉",
  },
  {
    slug: "firebase-app-hosting-nextjs",
    title: "Firebase App Hosting に Next.js を載せて分かったこと",
    excerpt:
      "静的ホスティングと何が違うのか、どこで詰まるのかを実装しながら整理しました。",
    date: "2026.07.28",
    category: "tech",
    thumb: "/assets/thumbs/thumb-2.svg",
    thumbAlt: "",
    author: "篠原 晴哉",
  },
  {
    slug: "observe-before-digitize",
    title: "紙の書類をなくす前に、業務のどこを見るか",
    excerpt:
      "現場に入って最初にやることは、システムの設計ではなく作業の観察でした。",
    date: "2026.07.14",
    category: "tech",
    thumb: "/assets/thumbs/thumb-3.svg",
    thumbAlt: "",
    // [要確認] 未確定#8：ブログの執筆担当
    author: "[要確認]",
  },
  {
    slug: "founded",
    title: "株式会社888を設立しました",
    excerpt: "設立にあたっての考えと、これから取り組むことについて。",
    date: "2026.07.01",
    category: "news",
    thumb: "/assets/thumbs/thumb-4.svg",
    thumbAlt: "",
    author: "篠原 晴哉",
  },
];

/** 記事本文はメディア側にしか置かない。本体からは絶対URLで送る */
export function postUrl(post: Post): string {
  return mediaUrl(`/${post.slug}`);
}
