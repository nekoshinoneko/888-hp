"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * [data-reveal] を IntersectionObserver で監視して is-visible を付けるだけの部品。
 * 表示を持たないのでレイアウトに1つ置く（指示書 3.3）。
 *
 * 守ること：
 * - 一度表示したら unobserve する。往復スクロールで再生させない
 * - IntersectionObserver 非対応と prefers-reduced-motion では即時表示
 *   （フォールバックを入れないと本文が透明のまま消える）
 *
 * JS自体が無効な場合は、この部品は動かない。そちらは layout.tsx の
 * <noscript> のスタイルで受ける。
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (items.length === 0) return;

    const showAll = () => {
      for (const el of items) el.classList.add("is-visible");
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    for (const el of items) io.observe(el);

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
