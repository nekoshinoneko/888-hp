"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * スクロール量を CSS のカスタムプロパティに落とすだけの部品。
 *
 * adoor.inc は GSAP ScrollTrigger の pin + scrub で同じことをしているが、
 * pin は position:sticky で足りるので、JSに残る仕事は「進捗を書く」1点だけになる。
 * ライブラリを足していないぶん、指示書の表示速度の条件を壊さない。
 *
 * - [data-stage] の要素に --p（0→1）を書く。演出はすべてCSS側の calc() が持つ
 * - <html> に --scroll-progress を書く（左端のレール用）
 *
 * 見出しの光（指示書3.2）はここでは触らない。マークアップ側に is-shining を
 * 直接書いてあり、読み込み時に1回走る。
 *
 * prefers-reduced-motion では --p を終端に固定して、以降は何も監視しない。
 */
export function ScrollStage() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const stages = Array.from(
      document.querySelectorAll<HTMLElement>("[data-stage]"),
    );

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      for (const stage of stages) stage.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;

      const scrollable = root.scrollHeight - window.innerHeight;
      root.style.setProperty(
        "--scroll-progress",
        scrollable > 0
          ? String(Math.min(1, Math.max(0, window.scrollY / scrollable)))
          : "0",
      );

      for (const stage of stages) {
        const travel = stage.offsetHeight - window.innerHeight;
        const top = stage.getBoundingClientRect().top;
        const p =
          travel > 0
            ? Math.min(1, Math.max(0, -top / travel))
            : top <= 0
              ? 1
              : 0;

        stage.style.setProperty("--p", p.toFixed(4));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // 非表示のあいだ rAF は止まるので、戻ってきたときに一度測り直す
    document.addEventListener("visibilitychange", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
