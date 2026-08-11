"use client";

/**
 * 記事の編集画面（要件 REQ-01〜05）。
 *
 * 下書きは途中でも保存できる。公開・予約に切り替えたときだけ全項目を検査する
 * （アイキャッチ必須などは要件6.3）。検査はサーバー側でも同じものを通す。
 */

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  deleteArticleAction,
  saveArticleAction,
  type ArticleInput,
} from "@/app/admin/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  ARTICLE_STATUSES,
  CATEGORIES,
  CATEGORY_IDS,
  EMPTY_DOC,
  type Article,
  type ArticleStatus,
  type Author,
  type CategoryId,
  type Eyecatch,
  type RichTextDoc,
} from "@/lib/cms/schema";
import { uploadImage } from "@/lib/firebase/upload";

const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: "下書き",
  scheduled: "予約投稿",
  published: "公開",
};

/** 推奨サイズ（要件6.3）。下回っても保存はできるが警告を出す */
const RECOMMENDED_W = 1200;
const RECOMMENDED_H = 630;

export function ArticleForm({
  initial,
  authors,
  isNew,
}: {
  initial: Article;
  authors: Author[];
  isNew: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [uploadingEyecatch, setUploadingEyecatch] = useState(false);

  const [slug, setSlug] = useState(initial.slug);
  const [title, setTitle] = useState(initial.title);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [category, setCategory] = useState<CategoryId>(initial.category);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [hashtags, setHashtags] = useState(initial.hashtags.join(" "));
  const [authorIds, setAuthorIds] = useState<string[]>(initial.authorIds);
  const [eyecatch, setEyecatch] = useState<Eyecatch | null>(initial.eyecatch);
  const [body, setBody] = useState<RichTextDoc>(initial.body ?? EMPTY_DOC);
  const [status, setStatus] = useState<ArticleStatus>(initial.status);
  const [publishedAt, setPublishedAt] = useState(
    initial.publishedAt ? toLocalInput(initial.publishedAt) : "",
  );

  const save = () => {
    setErrors([]);
    setSaved(false);

    const input: ArticleInput = {
      slug: slug.trim(),
      previousSlug: isNew ? undefined : initial.slug,
      title,
      excerpt,
      eyecatch,
      category,
      tags: splitList(tags, ","),
      hashtags: splitList(hashtags, /[\s,]+/).map((t) =>
        t.startsWith("#") ? t : `#${t}`,
      ),
      authorIds,
      // エディタが返す構造をそのまま送らず、素のJSONに均してから渡す。
      // Firestore は値を直列化するときにオブジェクトの中を辿るので、
      // プロキシや関数が1つでも混ざると保存時に落ちる。
      body: JSON.parse(JSON.stringify(body)) as RichTextDoc,
      status,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    };

    startTransition(async () => {
      const result = await saveArticleAction(input);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      if (isNew || input.slug !== initial.slug) {
        router.replace(`/admin/articles/${input.slug}`);
      }
      router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm(`「${title || slug}」を削除します。戻せません。`)) return;
    startTransition(async () => {
      await deleteArticleAction(initial.slug);
      router.replace("/admin");
    });
  };

  const pickEyecatch = async (file: File) => {
    setUploadingEyecatch(true);
    setErrors([]);
    try {
      const uploaded = await uploadImage(file, "eyecatch");
      setEyecatch({
        url: uploaded.url,
        path: uploaded.path,
        alt: eyecatch?.alt ?? "",
        width: uploaded.width,
        height: uploaded.height,
      });
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "アップロードに失敗しました"]);
    } finally {
      setUploadingEyecatch(false);
    }
  };

  const eyecatchTooSmall =
    eyecatch && (eyecatch.width < RECOMMENDED_W || eyecatch.height < RECOMMENDED_H);

  return (
    <div className="form">
      <div className="admin__pageHead">
        <h1>{isNew ? "新しい記事" : "記事を編集"}</h1>
        <div className="form__actions">
          {!isNew && (
            <button
              type="button"
              className="btn btn--ghost form__delete"
              onClick={remove}
              disabled={pending}
            >
              削除
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={save}
            disabled={pending || uploadingEyecatch}
          >
            {pending ? "保存中…" : "保存"}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <ul className="form__errors" role="alert">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {saved && errors.length === 0 && (
        <p className="form__saved" role="status">
          保存しました
        </p>
      )}

      <div className="form__grid">
        <div className="form__main">
          <label className="field">
            <span className="field__label">タイトル</span>
            <input
              className="field__input field__input--title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (isNew && !slug) setSlug("");
              }}
              placeholder="記事のタイトル"
            />
          </label>

          <label className="field">
            <span className="field__label">
              スラッグ
              <small>
                記事のURLになります。英小文字・数字・ハイフンのみ
              </small>
            </span>
            <input
              className="field__input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="demostage-in-summer-report"
            />
          </label>

          <label className="field">
            <span className="field__label">
              抜粋
              <small>一覧とOGPの説明文に使います</small>
            </span>
            <textarea
              className="field__input"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </label>

          <div className="field">
            <span className="field__label">本文</span>
            <RichTextEditor
              value={body}
              onChange={setBody}
              onUploadImage={async (file) => {
                const uploaded = await uploadImage(file, "body");
                return uploaded.url;
              }}
            />
          </div>
        </div>

        <aside className="form__side">
          <div className="panel">
            <h2 className="panel__title">公開</h2>

            <label className="field">
              <span className="field__label">状態</span>
              <select
                className="field__input"
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              >
                {ARTICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">
                公開日時
                <small>予約投稿のときは未来の日時を入れます</small>
              </span>
              <input
                className="field__input"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </label>

            {status === "scheduled" && (
              <p className="panel__note">
                予約した時刻に自動で公開する仕組みはまだ入っていません。
                いまは時刻を過ぎても手動で「公開」に切り替える必要があります。
              </p>
            )}
          </div>

          <div className="panel">
            <h2 className="panel__title">
              アイキャッチ<span className="panel__req">必須</span>
            </h2>

            {eyecatch ? (
              <div className="eyecatch">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={eyecatch.url} alt="" className="eyecatch__img" />
                <p className="eyecatch__size">
                  {eyecatch.width}×{eyecatch.height}px
                </p>
                {eyecatchTooSmall && (
                  <p className="panel__warn">
                    推奨は {RECOMMENDED_W}×{RECOMMENDED_H}px です。
                    小さいとXでの見え方が荒くなります。
                  </p>
                )}
                <label className="field">
                  <span className="field__label">
                    代替テキスト<small>画像の内容を短く</small>
                  </span>
                  <input
                    className="field__input"
                    value={eyecatch.alt}
                    onChange={(e) =>
                      setEyecatch({ ...eyecatch, alt: e.target.value })
                    }
                  />
                </label>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setEyecatch(null)}
                >
                  外す
                </button>
              </div>
            ) : (
              <p className="panel__note">
                未設定です。公開するには必要です（OGP画像にも使います）。
              </p>
            )}

            <input
              type="file"
              accept="image/*"
              disabled={uploadingEyecatch}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void pickEyecatch(file);
                e.target.value = "";
              }}
            />
            {uploadingEyecatch && <p className="panel__note">アップロード中…</p>}
          </div>

          <div className="panel">
            <h2 className="panel__title">分類</h2>

            <label className="field">
              <span className="field__label">カテゴリ</span>
              <select
                className="field__input"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
              >
                {CATEGORY_IDS.map((id) => (
                  <option key={id} value={id}>
                    {CATEGORIES[id].label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">
                タグ<small>カンマ区切り</small>
              </span>
              <input
                className="field__input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Next.js, Firebase"
              />
            </label>

            <label className="field">
              <span className="field__label">
                ハッシュタグ<small>Xでシェアするときに付きます</small>
              </span>
              <input
                className="field__input"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#demo_stage_summer"
              />
            </label>
          </div>

          <div className="panel">
            <h2 className="panel__title">
              著者<small className="panel__sub">共著は複数選択</small>
            </h2>
            {authors.length === 0 ? (
              <p className="panel__note">
                著者がまだ登録されていません。ログインすると自動で作られます。
              </p>
            ) : (
              <ul className="checks">
                {authors.map((author) => (
                  <li key={author.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={authorIds.includes(author.id)}
                        onChange={(e) =>
                          setAuthorIds((prev) =>
                            e.target.checked
                              ? [...prev, author.id]
                              : prev.filter((id) => id !== author.id),
                          )
                        }
                      />
                      {author.displayName}
                      {author.role && (
                        <small className="checks__role">{author.role}</small>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function splitList(value: string, separator: string | RegExp): string[] {
  return value
    .split(separator)
    .map((v) => v.trim())
    .filter(Boolean);
}

/** datetime-local 用にローカル時刻の文字列へ。ISOだとUTCになってずれる */
function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
