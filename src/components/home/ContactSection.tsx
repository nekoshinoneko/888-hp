import Link from "next/link";

import { reveal } from "@/components/motion/reveal";

/**
 * 7. お問い合わせ（CTA）
 * CTAは「お問い合わせ」に統一する。「無料トライアル」「今すぐ使う」等は置かない。
 *
 * リンク先の /contact は実装順序5で作る。
 */
export function ContactSection() {
  return (
    <section className="contact wrap" id="contact">
      <p className="eyebrow" {...reveal()}>
        お問い合わせ
      </p>
      <h2 {...reveal(1)}>「これ、システムにできますか」から。</h2>
      <p className="lede" {...reveal(2)}>
        要件が固まっていない段階でも構いません。現場で何に時間がかかっているかを聞かせてください。
      </p>
      <div className="contact__actions" {...reveal(3)}>
        {/* /contact は実装順序5で作る。next/link にしておくと basePath 配下でも壊れない。
            ページがまだ無いので、プリフェッチだけ切っておく（404を取りにいかせない） */}
        <Link className="btn" href="/contact" prefetch={false}>
          お問い合わせフォーム
        </Link>
        <a className="btn btn--ghost" href="#media">
          技術ブログを見る
        </a>
      </div>
    </section>
  );
}
