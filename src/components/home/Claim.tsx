import { reveal } from "@/components/motion/reveal";

/**
 * 2. 事業の言い切り
 * 「開発でシステムを受注する会社」と明示する（指示書 1.3）。
 */
export function Claim() {
  return (
    <section className="claim" id="service">
      <div className="wrap">
        <p className="eyebrow" {...reveal()}>
          事業
        </p>
        <h2 {...reveal(1)}>開発でシステムを受注する会社です。</h2>
        <p className="lede" {...reveal(2)}>
          受託開発を主軸に、自社プロダクトの開発と、技術イベントの企画運営を行っています。
          受託では要件の整理から実装、運用までを一貫して担当します。
          自分たちでプロダクトを持っているので、つくったあとに何が起きるかを踏まえて設計できます。
        </p>
      </div>
    </section>
  );
}
