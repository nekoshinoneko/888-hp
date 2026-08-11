import { reveal } from "@/components/motion/reveal";

/**
 * 4. 取り組んでいる領域
 * 自社プロダクト3本を「AIで人手の作業を減らす」の括りで短く（指示書 1.3）。
 *
 * ステータス（提供中／開発中）を書かない。提供中だと誤認させる表現も置かない。
 * 料金・導入事例・お客様の声・「無料トライアル」等のCTAは禁止。
 * 書いてよいのは課題とアプローチまで（指示書「絶対に守ること > コピー」）。
 *
 * [要確認] 未確定#4：安全書類サービスの説明内容（前田さん）
 * [要確認] 未確定#5：福祉領域・MEO/AIO の説明文 各2〜3行（陣内さん）
 * 下の文面は prototype.html の暫定文。確認が取れたら差し替える。
 */
const fields = [
  {
    n: "01",
    title: "安全書類の作成",
    description:
      "工事現場でやり取りされる安全書類の作成と提出にかかる時間を減らします。",
  },
  {
    n: "02",
    title: "福祉の事務作業",
    description:
      "福祉の現場で発生する記録や事務処理を整理し、支援そのものに時間を回せるようにします。",
  },
  {
    n: "03",
    title: "店舗の集客",
    description:
      "地図検索とAI検索の両方から見つけてもらうための、店舗向けの仕組みを開発しています。",
  },
];

export function Fields() {
  return (
    <section className="sec wrap">
      <div className="sec__head">
        <p className="eyebrow" {...reveal()}>
          取り組んでいる領域
        </p>
        <h2 {...reveal(1)}>人がやらなくていい作業から、順に減らす。</h2>
        <p className="lede" {...reveal(2)}>
          自社でプロダクトをつくりながら、業界ごとに残っている手作業を扱っています。
        </p>
      </div>

      <div className="fields">
        {fields.map((field, i) => (
          <div className="field" key={field.n} {...reveal(i)}>
            <span className="field__n">{field.n}</span>
            <p className="field__t">{field.title}</p>
            <p className="field__d">{field.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
