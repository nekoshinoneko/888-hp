import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OpeningSeenScript } from "@/components/motion/Opening";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { asset, siteConfig } from "@/content/site";

import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/motion.css";
import "@/styles/layout.css";
import "@/styles/home.css";

/**
 * OGP・構造化データ・sitemap・robots は実装順序7でまとめて入れる。
 * ドメインが未確定（未確定#2）のため、いまは絶対URLを出す設定を置かない。
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    // 96px未満は「株式会社」を外した小サイズ専用版を使う（指示書）
    icon: [
      { url: asset("/icon.svg"), type: "image/svg+xml" },
      { url: asset("/favicon.ico"), sizes: "32x32 48x48" },
    ],
    apple: [{ url: asset("/apple-touch-icon.png"), sizes: "180x180" }],
  },

  // レビュー用の公開（GitHub Pages）を検索結果に出さない。
  // 本番では NEXT_PUBLIC_NOINDEX を設定しないので付かない。
  robots:
    process.env.NEXT_PUBLIC_NOINDEX === "1"
      ? { index: false, follow: false }
      : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * JSを無効にすると ScrollReveal が動かず、[data-reveal] が透明のまま消える。
 * 本文が読めなくなるので noscript で表示状態に戻す（受け入れ基準）。
 */
const noScriptFallback = `[data-reveal]{opacity:1!important;transform:none!important}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // suppressHydrationWarning：OpeningSessionScript が <html> に is-opening-seen を
  // 付けるので、サーバーが返したHTMLとクラスが一致しない。これは意図した差分。
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <OpeningSeenScript />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noScriptFallback }} />
        </noscript>
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
