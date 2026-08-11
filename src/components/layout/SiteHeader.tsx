import Link from "next/link";

import { Logo888 } from "@/components/brand/Logo888";
import { navLinks } from "@/content/site";

/**
 * ヘッダー。
 * ロゴの横に「株式会社888」と書かない。ロゴに社名が入っていて重複するため（指示書）。
 */
export function SiteHeader() {
  return (
    <header className="site-head">
      <div className="wrap site-head__in">
        <Link className="brand" href="/" aria-label="株式会社888 ホーム">
          <Logo888 className="brand__logo" />
        </Link>

        <nav className="site-nav" aria-label="メインナビゲーション">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTAは「お問い合わせ」に統一する（指示書「絶対に守ること > コピー」） */}
        <a className="btn" href="#contact">
          お問い合わせ
        </a>
      </div>
    </header>
  );
}
