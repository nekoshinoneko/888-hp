# 株式会社888 コーポレートサイト

公開日は **2026年8月31日**。スコープを増やす前に必ず確認を取る。

仕様の原典は `docs/888-HP-指示書.md`、見た目と動きの正は `docs/prototype.html`。
どちらも社内向けの内容なので、このリポジトリ（レビュー用にパブリック公開）には入れていない。
手元では `docs/` に置いてあり、`.gitignore` で除外している。

> このリポジトリはレビュー用の一時的なものです。
> 本番は Firebase App Hosting で、静的書き出し（GitHub Pages）は実装順序4までの暫定手段です。

## 動かす

```bash
npm install
npm run dev
```

| コマンド | 内容 |
| :-- | :-- |
| `npm run dev` | 開発サーバー（http://localhost:3000） |
| `npm run build` | 本番ビルド |
| `npm run start` | ビルド済みの起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 型チェック |

`npm run build` は `.next/` を dev サーバーと共有するので、dev を止めてから実行する。

### レビュー用の公開（GitHub Pages）

main に push すると `.github/workflows/preview-pages.yml` が静的書き出しして Pages へ出す。
`noindex` を付けているので検索結果には出ない。

```bash
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/888-hp npm run build   # 手元で同じものを作る
```

本番の構成を変えたわけではない。`STATIC_EXPORT=1` のときだけ静的書き出しに切り替わる。
実装順序5（問い合わせフォーム）でサーバー実行が必要になったらこの経路は使えなくなるので、
そのタイミングでワークフローを外して App Hosting に一本化する。

## いまどこまで

実装順序（指示書 8）の **1 と 2 まで**。

- [x] 1. Next.js + TypeScript の初期構築、トークンとレイアウトの実装
- [x] 2. トップページ（オープニング・見出しの光・スクロール演出を含む）
- [ ] 3. 静的ページ（事業／会社概要／代表紹介／プライバシーポリシー）
- [ ] 4. CMS選定とスキーマ作成、メディアの一覧・記事詳細・著者ページ
- [ ] 5. 問い合わせフォーム
- [ ] 6. いいね（Firestore＋セキュリティルール）
- [ ] 7. OGP・SEO・解析の設定
- [ ] 8. 記事3本の投入、全ブレークポイントでの確認

3以降が未着手なので、いまリンク切れになる先がある。

- ヘッダーのナビはトップページ内アンカー（`#service` など）。実装順序3で実ページへ差し替える
- 「お問い合わせフォーム」の `/contact` はまだ無い（実装順序5）
- ブログの記事リンクは `media.888.co.jp` の想定URL。メディア側は実装順序4

## 構成

```
src/
  app/
    layout.tsx          ヘッダー・フッター・metadata・noscriptフォールバック
    page.tsx            トップページ（ブロックの順序は指示書1.3のとおり）
  components/
    brand/Logo888.tsx   公式ロゴ。01_横長.svg の写し
    layout/             SiteHeader / SiteFooter / RuledHeading
    motion/             Opening / ScrollReveal / reveal()
    home/               トップの各ブロック
  content/
    site.ts             URL・ナビ・会社概要
    posts.ts            ブログの仮データ（実装順序4でCMSに差し替え）
  styles/
    tokens.css          色・モーションの時間・幅（指示書2.1）
    base.css            リセット・タイポ・共通パーツ
    motion.css          オープニング／見出しの光／スクロール演出
    layout.css          ヘッダー・フッター
    home.css            トップの各ブロック
public/
  assets/logos/         公式ロゴ。中身を編集しない。描き起こさない
  assets/thumbs/        ブログの仮アイキャッチ
  favicon.ico / icon.svg / apple-touch-icon.png
                        上記 logos/ からの複製（中身は同一）。
                        日本語ファイル名をURLに出さないため root に置いている
docs/                   指示書・要件定義ドラフト・prototype.html
```

## 触るときに壊しやすいところ

指示書の「絶対に守ること」と「受け入れ基準」から、実装に直結するものだけ。

- **ロゴを描き起こさない。** `Logo888.tsx` の path は `public/assets/logos/01_横長.svg` の写し。
  直すときは実ファイルを直してから写し直す。
- **イエロー（`--accent`）を文字色にしない。面で塗らない。** 使ってよいのは
  小見出しの頭の丸、番号バッジの背景、タグの背景まで。
- **`prefers-reduced-motion: reduce` を消さない。** `motion.css` 末尾のブロック。
  `.shine` は animation を消すだけだと文字が透明のまま消えるので、
  `background-image:none` と `-webkit-text-fill-color` の復帰も必ず一緒に残す。
- **オープニングの幕をJSで消さない。** CSSアニメーションだけで上がる。
  JSの役割は「同一セッション内で2回目以降は出さない」判定だけ（`sessionStorage`）。
- **`[data-reveal]` は初期状態が透明。** JS無効時に本文が消えないよう
  `layout.tsx` の `<noscript>` で表示に戻している。消さない。
- **実績の数字・料金・導入事例・「無料トライアル」等のCTAを書かない。** CTAは「お問い合わせ」に統一。
- 社名の由来は「8を連打して拍手」。末広がり・縁起物として説明しない。

## 環境変数

`.env.example` を `.env.local` に写して使う。値をコードに直接書かない。

いま実際に読んでいるのは `NEXT_PUBLIC_SITE_URL` と `NEXT_PUBLIC_MEDIA_URL` の2つだけ。
ドメインが未確定（未確定#2）なので、未設定のときは `src/content/site.ts` の暫定値が入る。

## Node のバージョン

Next.js は 15.5 系。Next 16 は Node 20.9 以上が要るので、上げるなら Node も一緒に上げる。

## `[要確認]` を置いてある場所

指示書10「未確定」のうち、画面に出るもの。埋める前に確認先へ。

| 場所 | 内容 | 確認先 |
| :-- | :-- | :-- |
| フッター 会社概要 | 設立・所在地・資本金 | 山本さん（未確定#1） |
| `src/content/site.ts` | 本体／メディアのドメイン | 山本さん（未確定#2） |
| DemoStage 会場 | 大阪市内から先の詳細 | — |
| ブログ4件 | 記事そのものが仮データ。著者名にも1件 `[要確認]` | 篠原＋執筆担当（未確定#12・#8） |
| `src/components/home/Fields.tsx` | 安全書類／福祉／MEO・AIO の説明文 | 前田さん・陣内さん（未確定#4・#5） |
