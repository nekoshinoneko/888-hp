"use client";

/**
 * 本文のリッチテキストエディタ（要件 REQ-01）。
 *
 * 非エンジニアが書く前提なので、Markdown記法を覚えなくても
 * ボタンだけで見出し・太字・リスト・リンク・画像・YouTubeが入るようにしている。
 *
 * 保存するのは JSON。HTML文字列にはしない（schema.ts の RichTextDoc 参照）。
 */

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";

import { editorExtensions } from "@/lib/cms/editor-extensions";
import type { RichTextDoc } from "@/lib/cms/schema";

type Props = {
  value: RichTextDoc;
  onChange: (doc: RichTextDoc) => void;
  /** 本文中の画像をアップロードして公開URLを返す */
  onUploadImage: (file: File) => Promise<string>;
};

export function RichTextEditor({ value, onChange, onUploadImage }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: value,
    // SSRとクライアントの初回描画を食い違わせないため（Tiptapの推奨）
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON() as RichTextDoc),
    editorProps: {
      attributes: {
        class: "editor__content",
      },
      handleDrop: (_view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file || !file.type.startsWith("image/")) return false;
        event.preventDefault();
        void insertImage(file);
        return true;
      },
      handlePaste: (_view, event) => {
        const file = event.clipboardData?.files?.[0];
        if (!file || !file.type.startsWith("image/")) return false;
        event.preventDefault();
        void insertImage(file);
        return true;
      },
    },
  });

  const insertImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploading(true);
      try {
        const url = await onUploadImage(file);
        editor.chain().focus().setImage({ src: url, alt: "" }).run();
      } catch (error) {
        window.alert(
          `画像のアップロードに失敗しました：${
            error instanceof Error ? error.message : "不明なエラー"
          }`,
        );
      } finally {
        setUploading(false);
      }
    },
    [editor, onUploadImage],
  );

  if (!editor) {
    return <div className="editor editor--loading">エディタを読み込み中…</div>;
  }

  return (
    <div className="editor">
      <Toolbar
        editor={editor}
        uploading={uploading}
        onPickImage={() => fileInput.current?.click()}
      />
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertImage(file);
          e.target.value = "";
        }}
      />
      <EditorContent editor={editor} />
      <p className="editor__hint">
        画像はドラッグ＆ドロップ、または貼り付けでも入ります。
      </p>
    </div>
  );
}

function Toolbar({
  editor,
  uploading,
  onPickImage,
}: {
  editor: Editor;
  uploading: boolean;
  onPickImage: () => void;
}) {
  const addLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("リンク先のURL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTubeのURL");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  };

  return (
    <div className="editor__bar" role="toolbar" aria-label="書式">
      <Btn
        on={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        見出し
      </Btn>
      <Btn
        on={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        小見出し
      </Btn>
      <Btn
        on={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <b>太字</b>
      </Btn>
      <Btn
        on={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        箇条書き
      </Btn>
      <Btn
        on={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        番号付き
      </Btn>
      <Btn
        on={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        引用
      </Btn>
      <Btn
        on={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        コード
      </Btn>
      <Btn on={editor.isActive("link")} onClick={addLink}>
        リンク
      </Btn>
      <Btn on={false} onClick={onPickImage} disabled={uploading}>
        {uploading ? "アップロード中…" : "画像"}
      </Btn>
      <Btn on={false} onClick={addYoutube}>
        YouTube
      </Btn>
    </div>
  );
}

function Btn({
  on,
  onClick,
  disabled,
  children,
}: {
  on: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="editor__btn"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
