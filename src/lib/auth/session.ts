import "server-only";

/**
 * 執筆者のセッション（要件 NEW-02 / 6.6）。
 *
 * ブラウザで Google ログイン → ID トークンをサーバーへ渡す → ここで検証して
 * session cookie を張る、という流れ。ID トークンを直接 cookie に置かない。
 * 有効期限が1時間しかなく、失効させる手段も無いため。
 *
 * ドメイン制限は「サーバー側で」かける。クライアント側の hd 指定は
 * ログイン画面の絞り込みでしかなく、任意のトークンを投げられたら素通りする。
 */

import { cookies } from "next/headers";

import { isAllowedEmail } from "@/lib/auth/domain";
import { ensureAuthorForLogin } from "@/lib/cms/repository";
import { type Author } from "@/lib/cms/schema";
import { adminAuth } from "@/lib/firebase/admin";

const COOKIE_NAME = "888_session";
const MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000; // 5日

export type SessionUser = {
  uid: string;
  email: string;
  author: Author;
};

/**
 * ID トークンを検証してセッションを開始する。
 * 弾く条件：メール未確認、社外ドメイン。
 */
export async function createSession(
  idToken: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const decoded = await adminAuth().verifyIdToken(idToken, true);

  if (!decoded.email) {
    return { ok: false, reason: "メールアドレスが取得できませんでした" };
  }
  if (!decoded.email_verified) {
    return { ok: false, reason: "メールアドレスが未確認のアカウントです" };
  }
  if (!isAllowedEmail(decoded.email)) {
    return {
      ok: false,
      reason: "社外のアカウントではログインできません",
    };
  }

  const sessionCookie = await adminAuth().createSessionCookie(idToken, {
    expiresIn: MAX_AGE_MS,
  });

  await ensureAuthorForLogin({
    email: decoded.email,
    displayName: (decoded.name as string) ?? "",
    photoUrl: (decoded.picture as string) ?? undefined,
  });

  const store = await cookies();
  store.set(COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_MS / 1000,
  });

  return { ok: true };
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * いまのセッション。未ログイン・失効・社外ドメインなら null。
 * ドメインは毎回見る。人が抜けてアカウントが消えたあとも
 * cookie が生きている間は通ってしまう、という状態を作らないため。
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME)?.value;
  if (!cookie) return null;

  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    if (!isAllowedEmail(decoded.email)) return null;

    const author = await ensureAuthorForLogin({
      email: decoded.email!,
      displayName: (decoded.name as string) ?? "",
      photoUrl: (decoded.picture as string) ?? undefined,
    });

    return { uid: decoded.uid, email: decoded.email!, author };
  } catch {
    // 失効・改ざん・エミュレータ再起動など。未ログイン扱いにする
    return null;
  }
}

/** /admin 配下で使う。未ログインなら例外ではなく null を返して呼び出し側で redirect する */
export async function requireSessionUser(): Promise<SessionUser | null> {
  return getSessionUser();
}
