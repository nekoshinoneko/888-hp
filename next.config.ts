import path from "node:path";

import type { NextConfig } from "next";

/**
 * 本番は Firebase App Hosting（Cloud Run）。静的書き出しにはしない。
 * 問い合わせのメール送信と記事の即時公開にサーバー側の実行が要るため（指示書 5.1）。
 *
 * 例外として、レビュー用に GitHub Pages へ置くときだけ STATIC_EXPORT=1 で
 * 静的書き出しに切り替える。いまはトップページ1枚で完全に静的なので成立するが、
 * 実装順序5（問い合わせフォーム）に入った時点でこの経路は使えなくなる。
 * 本番の構成をここで変えたわけではない。
 */
const isStaticPreview = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 親ディレクトリにも lockfile があるとルートを取り違える。
  // ビルドトレースがずれるとデプロイでファイルを取りこぼすので明示する。
  outputFileTracingRoot: path.join(__dirname),

  ...(isStaticPreview
    ? {
        output: "export" as const,
        // https://<user>.github.io/888-hp/ のようにサブパスへ置かれるため
        basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
        images: { unoptimized: true },
        // 静的ホスティングは /foo を /foo/index.html として配る。
        // これが無いと next/link のプリフェッチが /888-hp.txt を取りにいって404になる。
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
