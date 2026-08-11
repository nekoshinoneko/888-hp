"use client";

import { useState } from "react";

import { reveal } from "@/components/motion/reveal";
import {
  categories,
  categoryLabel,
  postUrl,
  type Post,
  type PostCategory,
} from "@/content/posts";
import { asset } from "@/content/site";

/**
 * 記事一覧（指示書 4.1）
 * 1件＝1行。サムネイル／日付／カテゴリタグ／タイトル／抜粋／著者。行全体がリンク。
 * 抜粋はモバイルで隠す（CSS側 .post__x）。
 *
 * 絞り込みはこの場で state を持つだけ。JSが無効なら全件が出る。
 */
export function PostList({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<"all" | PostCategory>("all");

  const visible =
    active === "all" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      <div
        className="chips"
        role="group"
        aria-label="カテゴリで絞り込む"
        {...reveal(1)}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            className="chip"
            type="button"
            aria-pressed={active === category.id}
            onClick={() => setActive(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <ul className="posts" {...reveal(2)}>
        {visible.map((post) => (
          <li key={post.slug}>
            <a className="post" href={postUrl(post)}>
              <span className="post__thumb">
                {/* 仮のアイキャッチ。実装順序4でCMSの画像に差し替えるため、
                    いまは next/image を使わず素の img で置いておく。 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(post.thumb)}
                  alt={post.thumbAlt}
                  width={640}
                  height={400}
                  loading="lazy"
                />
              </span>
              <span className="post__body">
                <span className="post__meta">
                  <span className="post__date">{post.date}</span>
                  <span className={`post__tag post__tag--${post.category}`}>
                    {categoryLabel[post.category]}
                  </span>
                </span>
                <span className="post__t">{post.title}</span>
                <span className="post__x">{post.excerpt}</span>
                <span className="post__by">
                  <span className="post__av" />
                  {post.author}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
