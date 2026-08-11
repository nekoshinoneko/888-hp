import type { Metadata } from "next";
import Link from "next/link";

import { signOut } from "@/app/admin/actions";
import { getSessionUser } from "@/lib/auth/session";

import "@/styles/admin.css";

/** 管理画面は絶対に検索させない */
export const metadata: Metadata = {
  title: "記事管理 ｜ 株式会社888",
  robots: { index: false, follow: false },
};

/** セッションを毎回見るので静的化しない */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  // ログイン画面自身もこのレイアウトを通る。未ログインなら中身だけ出す
  if (!user) {
    return <div className="admin admin--bare">{children}</div>;
  }

  return (
    <div className="admin">
      <header className="admin__head">
        <div className="admin__brand">
          <Link href="/admin">記事管理</Link>
        </div>
        <nav className="admin__nav">
          <Link href="/admin">記事</Link>
          <Link href="/admin/authors">著者</Link>
        </nav>
        <div className="admin__me">
          <span className="admin__meName">{user.author.displayName}</span>
          <form action={signOut}>
            <button type="submit" className="admin__logout">
              ログアウト
            </button>
          </form>
        </div>
      </header>
      <main className="admin__body">{children}</main>
    </div>
  );
}
