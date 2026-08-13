import "server-only";

/**
 * ログインを許可する Google Workspace のドメイン（要件 6.6）。
 *
 * 判定は必ずサーバー側で行う。クライアント側の hd 指定はログイン画面の
 * 絞り込みでしかなく、任意のIDトークンを直接投げられたら素通りするため。
 *
 * [要確認] 未確定#11：888の Google Workspace 管理ドメイン（CTO）
 * 要件 6.6 が指摘しているとおり、個人の Gmail を共有している状態だと
 * ドメイン制限そのものが成立しない。契約状況の確認が先。
 */
export const allowedAuthDomain = process.env.AUTH_ALLOWED_DOMAIN ?? "";

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  // ドメイン未設定のまま本番に出さないための保険。
  // 設定されていなければ誰も通さない（開けっ放しより閉じる方に倒す）。
  if (!allowedAuthDomain) return false;
  return email.toLowerCase().endsWith(`@${allowedAuthDomain.toLowerCase()}`);
}
