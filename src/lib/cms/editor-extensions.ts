/**
 * エディタと描画側で共有する拡張の一覧。
 *
 * ここが「本文に入りうるノードの全集合」になる。編集画面とサーバー描画で
 * 同じ定義を使わないと、保存できたのに表示されないノードが生まれる。
 * 拡張を足すときは必ずこのファイルに足す。
 *
 * クライアント／サーバーどちらからも読むので "use client" も "server-only" も付けない。
 */

import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      // h1 は記事タイトルが使うので、本文は h2 から（目次もこの階層で作る）
      levels: [2, 3, 4],
    },
    link: {
      openOnClick: false,
      autolink: true,
      // javascript: 等を弾く
      protocols: ["http", "https", "mailto"],
      HTMLAttributes: {
        rel: "noopener noreferrer",
      },
    },
  }),

  Image.configure({
    inline: false,
    // 本文中の画像も Cloud Storage に上げたものだけを入れる。
    // base64 を許すとドキュメントが肥大して Firestore の1MB上限に当たる。
    allowBase64: false,
  }),

  Youtube.configure({
    controls: true,
    nocookie: true,
    width: 640,
    height: 360,
  }),
];
