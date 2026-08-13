"use client";

import { useState, useTransition } from "react";

import { saveAuthorAction } from "@/app/admin/actions";
import type { Author } from "@/lib/cms/schema";

export function AuthorList({ authors }: { authors: Author[] }) {
  if (authors.length === 0) {
    return (
      <p className="admin__empty">
        まだ著者がいません。執筆者がログインすると自動で作られます。
      </p>
    );
  }

  return (
    <div className="authors">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}

function AuthorCard({ author }: { author: Author }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(author.displayName);
  const [role, setRole] = useState(author.role);
  const [bio, setBio] = useState(author.bio);
  const [isMember, setIsMember] = useState(author.isMember);
  const [x, setX] = useState(author.links.x ?? "");
  const [github, setGithub] = useState(author.links.github ?? "");
  const [website, setWebsite] = useState(author.links.website ?? "");

  const save = () => {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await saveAuthorAction({
        id: author.id,
        displayName,
        role,
        bio,
        avatarUrl: author.avatarUrl,
        links: {
          x: x || undefined,
          github: github || undefined,
          website: website || undefined,
        },
        isMember,
        email: author.email,
      });
      if (result.ok) setSaved(true);
      else setError(result.errors.join(" / "));
    });
  };

  return (
    <div className="panel authorCard">
      <div className="authorCard__head">
        {author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="authorCard__av" src={author.avatarUrl} alt="" />
        ) : (
          <span className="authorCard__av authorCard__av--initial">
            {displayName.slice(0, 1) || "?"}
          </span>
        )}
        <div>
          <p className="authorCard__name">{displayName || author.id}</p>
          <p className="authorCard__mail">{author.email}</p>
        </div>
      </div>

      <label className="field">
        <span className="field__label">表示名</span>
        <input
          className="field__input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field__label">役職・所属</span>
        <input
          className="field__input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="代表取締役"
        />
      </label>

      <label className="field">
        <span className="field__label">自己紹介</span>
        <textarea
          className="field__input"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </label>

      <div className="authorCard__links">
        <label className="field">
          <span className="field__label">X</span>
          <input
            className="field__input"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="https://x.com/…"
          />
        </label>
        <label className="field">
          <span className="field__label">GitHub</span>
          <input
            className="field__input"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field__label">Web</span>
          <input
            className="field__input"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <label className="authorCard__member">
        <input
          type="checkbox"
          checked={isMember}
          onChange={(e) => setIsMember(e.target.checked)}
        />
        メンバー紹介ページに出す
      </label>

      <div className="authorCard__foot">
        <button
          type="button"
          className="btn"
          onClick={save}
          disabled={pending}
        >
          {pending ? "保存中…" : "保存"}
        </button>
        {saved && <span className="form__saved">保存しました</span>}
        {error && <span className="form__errors">{error}</span>}
      </div>
    </div>
  );
}
