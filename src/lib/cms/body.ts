import "server-only";

/**
 * 本文のJSONを表示用HTMLに変換する。
 *
 * 保存されているのは構造（ProseMirror JSON）で、HTML文字列は毎回ここで作る。
 * そのうえでサニタイズも通す。二重に見えるが、
 * 「保存経路が1つでも緩んだときにXSSがDBに居座らない」ことを狙っている。
 */

import { generateHTML } from "@tiptap/html";
import rehypeParse from "rehype-parse";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

import { editorExtensions } from "@/lib/cms/editor-extensions";
import type { RichTextDoc, RichTextNode } from "@/lib/cms/schema";

/** 埋め込みを許す先。ここに無いホストの iframe は落とす */
const ALLOWED_IFRAME_PREFIXES = [
  "https://www.youtube.com/embed/",
  "https://www.youtube-nocookie.com/embed/",
];

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe", "figure", "figcaption"],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      "src",
      "width",
      "height",
      "allow",
      "allowfullscreen",
      "frameborder",
      "title",
    ],
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height", "loading"],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["https"],
    href: ["http", "https", "mailto"],
  },
};

/**
 * サニタイズを通ったあとの iframe を、許可したホストだけに絞る。
 * rehype-sanitize は属性の有無とプロトコルは見るが、ホストまでは見ないため。
 */
function dropForeignIframes() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "iframe" || !parent || index === undefined) return;
      const src = String(node.properties?.src ?? "");
      const ok = ALLOWED_IFRAME_PREFIXES.some((p) => src.startsWith(p));
      if (!ok) parent.children.splice(index, 1);
    });
  };
}

export function renderBodyToHtml(doc: RichTextDoc): string {
  const raw = generateHTML(doc, editorExtensions);

  return String(
    unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSanitize, schema)
      .use(dropForeignIframes)
      .use(rehypeStringify)
      .processSync(raw),
  );
}

/* ---------------- 目次（REQ-02） ---------------- */

export type TocEntry = { level: number; text: string; id: string };

/**
 * 見出しを拾って目次を作る。
 * HTMLを正規表現で舐めるのではなく、保存されている構造から直接取る。
 */
export function extractToc(doc: RichTextDoc): TocEntry[] {
  const entries: TocEntry[] = [];
  const used = new Map<string, number>();

  const walk = (nodes: RichTextNode[] | undefined) => {
    if (!nodes) return;
    for (const node of nodes) {
      if (node.type === "heading") {
        const level = Number(node.attrs?.level ?? 2);
        const text = plainText(node.content).trim();
        if (text) {
          const base = slugifyHeading(text);
          const seen = used.get(base) ?? 0;
          used.set(base, seen + 1);
          entries.push({ level, text, id: seen ? `${base}-${seen}` : base });
        }
      }
      walk(node.content);
    }
  };

  walk(doc.content);
  return entries;
}

function plainText(nodes: RichTextNode[] | undefined): string {
  if (!nodes) return "";
  return nodes
    .map((n) => (n.text ?? "") + plainText(n.content))
    .join("");
}

/**
 * 見出しからアンカーIDを作る。
 * 和文はそのままだとURLで潰れるので、英数字以外はハイフンに寄せ、
 * 何も残らなければ連番にフォールバックする。
 */
function slugifyHeading(text: string): string {
  const ascii = text
    .toLowerCase()
    .replace(/[^a-z0-9぀-ヿ一-龯]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || "section";
}

/** 一覧やOGPの説明文に使う、本文から起こした素のテキスト */
export function toPlainText(doc: RichTextDoc): string {
  return plainText(doc.content).replace(/\s+/g, " ").trim();
}
