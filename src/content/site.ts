/**
 * サイト全体で使う定数。
 *
 * URL は .env（NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_MEDIA_URL）から読む。
 * [要確認] 未確定#2：ドメインが未決定のため、下のフォールバックは暫定値。
 * 取得が済んだら .env.local と App Hosting 側に実値を入れて、ここは触らない。
 */
export const siteConfig = {
  /** コーポレートサイト本体 */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://888.co.jp",
  /** オウンドメディア（サブドメイン。記事本文はこちらに置く） */
  mediaUrl: process.env.NEXT_PUBLIC_MEDIA_URL ?? "https://media.888.co.jp",

  name: "株式会社888",
  title: "株式会社888 ｜ 現場の手作業を、AIで減らす。",
  description:
    "株式会社888は、現場に残る手作業をAIで減らすシステムを開発する会社です。受託開発と自社プロダクト開発、技術イベントの企画運営を行っています。",
} as const;

/**
 * サブパス配下（GitHub Pages のレビュー用など）に置かれたときのための接頭辞。
 * 本番の App Hosting では空文字なので、実質なにもしない。
 *
 * next/link と next/router は basePath を自動で付けるが、
 * 素の <img src> や metadata の icons は付かないので、そこだけこの関数を通す。
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(publicPath: string): string {
  return `${basePath}${publicPath}`;
}

/** メディア側の記事URLを組み立てる。本体側に記事本文は置かない（canonicalはメディア側） */
export function mediaUrl(path = "/"): string {
  return new URL(path, siteConfig.mediaUrl).toString();
}

/**
 * ヘッダーのナビゲーション。
 * 実装順序2の時点ではトップページ内のアンカー。
 * 実装順序3で /service・/company などの静的ページができたら差し替える。
 */
export const navLinks = [
  { href: "#service", label: "事業" },
  { href: "#proof", label: "私たちについて" },
  { href: "#event", label: "イベント" },
  { href: "#media", label: "ブログ" },
] as const;

/**
 * 会社概要（フッター）。
 * [要確認] 未確定#1：設立日・所在地・資本金・役員の正式情報は山本さん確認待ち。
 * 確認が取れるまで埋めない。
 */
export const companyProfile: { label: string; value: string; tbd?: boolean }[] =
  [
    { label: "商号", value: "株式会社888（パチパチパチ）" },
    { label: "代表取締役", value: "篠原 晴哉" },
    { label: "設立", value: "[要確認]", tbd: true },
    { label: "所在地", value: "[要確認]", tbd: true },
    { label: "資本金", value: "[要確認]", tbd: true },
    {
      label: "事業内容",
      value: "受託開発／自社プロダクト開発／技術イベントの企画運営",
    },
  ];
