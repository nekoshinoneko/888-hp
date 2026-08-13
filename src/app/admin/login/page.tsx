import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { allowedAuthDomain } from "@/lib/auth/domain";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="login">
      <h1 className="login__title">記事管理</h1>
      <p className="login__lead">
        888のGoogleアカウントでログインしてください。
      </p>

      {allowedAuthDomain ? (
        <p className="login__domain">
          <code>@{allowedAuthDomain}</code> のアカウントのみ
        </p>
      ) : (
        <p className="login__warn">
          ログインを許可するドメインが未設定のため、誰もログインできません。
          <code>AUTH_ALLOWED_DOMAIN</code> を設定してください。
          <br />
          [要確認] 未確定#11：888のGoogle Workspace管理ドメイン
        </p>
      )}

      <LoginForm hostedDomain={allowedAuthDomain || undefined} />
    </div>
  );
}
