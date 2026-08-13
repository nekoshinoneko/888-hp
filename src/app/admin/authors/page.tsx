import { redirect } from "next/navigation";

import { AuthorList } from "@/components/admin/AuthorList";
import { getSessionUser } from "@/lib/auth/session";
import { listAuthors } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

/**
 * 著者＝社員マスタ（指示書4.3）。
 * ここで直した内容が、記事の著者表示・著者別アーカイブ・メンバー紹介の
 * すべてに効く。別々に持たない。
 */
export default async function AuthorsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const authors = await listAuthors();

  return (
    <>
      <div className="admin__pageHead">
        <h1>著者</h1>
      </div>
      <p className="admin__lead">
        メンバー紹介ページ・代表紹介・記事の著者表示は、すべてこのデータを見ています。
        Googleから取り込んだ表示名とアイコンは初期値なので、ここで上書きできます。
      </p>
      <AuthorList authors={authors} />
    </>
  );
}
