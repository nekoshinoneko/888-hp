import { PostList } from "@/components/home/PostList";
import { RuledHeading } from "@/components/layout/RuledHeading";
import { reveal } from "@/components/motion/reveal";
import { placeholderPosts } from "@/content/posts";
import { siteConfig } from "@/content/site";

/**
 * 5. ブログ
 * 最新記事とカテゴリ絞り込み（指示書 1.3）。
 *
 * 記事本文は media.888.co.jp にしか置かない。ここからは絶対URLで送るだけ。
 * canonical はメディア側に統一する（指示書「絶対に守ること > 実装」）。
 *
 * いまは prototype.html の仮データを表示している。実装順序4でCMS取得に置き換える。
 */
export function BlogSection() {
  return (
    <section className="media" id="media">
      <div className="wrap">
        <RuledHeading
          title="ブログ"
          caption="つくる過程の記録・イベントの開催レポート・会社からのお知らせ"
        />

        <PostList posts={placeholderPosts} />

        <div className="media__more" {...reveal(3)}>
          <a className="btn btn--ghost" href={siteConfig.mediaUrl}>
            記事をすべて見る
          </a>
        </div>
      </div>
    </section>
  );
}
