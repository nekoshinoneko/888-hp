import { reveal } from "@/components/motion/reveal";

/**
 * 3. 技術力の根拠
 * 実績の代わりに信用を作る場所（指示書 1.3）。
 * 実績の数字は書かない。設立直後で出せる数字がないため（指示書「絶対に守ること > コピー」）。
 */
const rows = [
  {
    key: "代表",
    title: "篠原 晴哉",
    description:
      "ロボカップジュニアの全国大会出場を経て、専門学校在学中に技術部を立ち上げ、50名を超える規模まで運営。ハッカソンやコンテストでの受賞多数。",
  },
  {
    key: "メンバー",
    title: "在籍エンジニアの紹介",
    description:
      "誰が何を書いているのかが分かるように、メンバーごとのプロフィールと執筆記事を公開しています。",
  },
  {
    key: "技術ブログ",
    title: "つくる過程を書いています",
    description:
      "実装で詰まったこと、選んだ技術とその理由、イベントの開催記録を継続的に発信しています。",
  },
];

export function Proof() {
  return (
    <section className="sec wrap" id="proof">
      <div className="sec__head">
        <p className="eyebrow" {...reveal()}>
          私たちについて
        </p>
        <h2 {...reveal(1)}>つくっている人が、そのまま会社の中身です。</h2>
        <p className="lede" {...reveal(2)}>
          設立してまもない会社です。実績の数で語れることはまだ多くありません。
          代わりに、誰がどんな技術を持っていて、何を考えながらつくっているのかを公開しています。
        </p>
      </div>

      <div className="proof">
        {rows.map((row, i) => (
          <div className="proof__row" key={row.key} {...reveal(i)}>
            <p className="proof__k">{row.key}</p>
            <div>
              <p className="proof__t">{row.title}</p>
              <p className="proof__d">{row.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
