import { NextResponse } from "next/server";

import { createSession, destroySession } from "@/lib/auth/session";

/**
 * 執筆者セッションの発行と破棄。
 *
 * Server Action ではなく Route Handler にしているのは、
 * IDトークンとCookieの交換という素のHTTPのやり取りだからで、
 * curl で叩いて挙動を確かめられる方がこの手の処理は安全に運用できる。
 *
 * 誰を通すかの判定は createSession（＝サーバー側）が持つ。
 */
export async function POST(request: Request) {
  let idToken: unknown;
  try {
    ({ idToken } = await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "リクエストの形式が不正です" },
      { status: 400 },
    );
  }

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json(
      { ok: false, error: "IDトークンがありません" },
      { status: 400 },
    );
  }

  try {
    const result = await createSession(idToken);
    if (!result.ok) {
      // 通さなかった理由は返すが、どのドメインなら通るかまでは書かない
      return NextResponse.json(
        { ok: false, error: result.reason },
        { status: 403 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "トークンを検証できませんでした" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
