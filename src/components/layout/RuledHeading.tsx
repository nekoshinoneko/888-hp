import { reveal } from "@/components/motion/reveal";

/**
 * セクション見出しの型（指示書 2.3）
 *   見出し（font-weight:800）／2pxの濃い罫線／小さいグレーのキャプション
 * prototype.html ではブログ節に .media__head として書かれているが、
 * イベント節でも同じ型を使っているので共通部品にした。
 */
export function RuledHeading({
  title,
  caption,
  id,
}: {
  title: string;
  caption: string;
  id?: string;
}) {
  return (
    <div className="ruled-head" {...reveal()}>
      <h2 id={id}>{title}</h2>
      <div className="ruled-head__rule" />
      <p className="ruled-head__cap">{caption}</p>
    </div>
  );
}
