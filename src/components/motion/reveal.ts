import type { CSSProperties } from "react";

/**
 * スクロール演出（指示書 3.3）を要素に付ける。
 *
 *   <p className="eyebrow" {...reveal()}>事業</p>
 *   <h2 {...reveal(1)}>開発でシステムを受注する会社です。</h2>
 *
 * ずらし幅（--reveal-index）はマークアップ側の inline style で渡す。
 * JSに書かせない理由は、JSが動かない環境でも順番の指定だけは残しておきたいため。
 * 実際に表示へ切り替えるのは ScrollReveal と <noscript> のフォールバック。
 */
export type RevealProps = {
  "data-reveal": "";
  style: CSSProperties;
};

export function reveal(index = 0): RevealProps {
  return {
    "data-reveal": "",
    style: { "--reveal-index": index } as CSSProperties,
  };
}
