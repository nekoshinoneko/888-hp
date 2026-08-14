import { RuledHeading } from "@/components/layout/RuledHeading";
import { reveal } from "@/components/motion/reveal";
import { mediaUrl } from "@/content/site";

/**
 * 6. イベント事業（DemoStage）。全体の約1/3の比重（指示書 1.3）。
 *
 * イベント協賛の募集導線はここに置かない。別LPの担当（指示書 1.3）。
 *
 * 開催情報は prototype.html の記載をそのまま移したもの。
 * 会場の詳細は未確定のため埋めていない。
 *
 * 「なぜやるのか」は代表からの口頭の背景をもとにしている。
 * 在籍人数は「数名」までしか書かない（実績の数字を捏造しない・指示書）。
 */
const facts: { term: string; detail: string; tbd?: string }[] = [
  { term: "開催日", detail: "2026年8月2日（日）13:00 – 18:30" },
  { term: "会場", detail: "大阪市内", tbd: "[要確認]" },
  { term: "参加費", detail: "学生 無料／社会人 1,000円（閲覧のみ）" },
  { term: "規模", detail: "出展 約10作品・約30名" },
  { term: "主催", detail: "株式会社888 × 株式会社ローカルイノベーション" },
  { term: "ハッシュタグ", detail: "#demo_stage_summer" },
];

const program = [
  {
    n: "01",
    title: "作品紹介LT",
    description: "出展者が5分ずつ、自作プロダクトをプレゼンします。",
  },
  {
    n: "02",
    title: "交流タイム＆作品展示",
    description: "特設ブースで実機を触りながら、実装の話をします。",
  },
  {
    n: "03",
    title: "表彰",
    description: "当日の投票で最優秀賞（賞金5万円）を決定します。",
  },
];

export function EventSection() {
  return (
    <section className="event" id="event">
      <div className="wrap">
        <RuledHeading
          title="イベント事業"
          caption="つくる人が集まる場を、自分たちで開いています"
        />

        {/* なぜやるのか。ここは代表の思いなので吹き出しに入れている。
            要件定義2.1「DemoStageはイベント実績ではなく技術力の根拠として使う」
            という位置づけは変えず、その手前に動機を置いた。
            協賛の募集導線は置かない（指示書1.3・別LPの担当）。 */}
        <div className="ds__why bubble" {...reveal(1)}>
          <p className="ds__whyLead">打席に立てない学生が、少なくない。</p>
          <p className="lede">
            株式会社888は、昨年まで学生エンジニアだった篠原が代表として設立した会社です。
            いまも数名の学生エンジニアが在籍していて、関西・東海にルーツを持つメンバーが多く集まっています。
          </p>
          <p className="lede">
            採用も、人と会う機会も、東京に集まります。
            それ以外の地域にいる学生エンジニアは、力を見せる場所そのものに手が届きにくい。
            打席に立てないまま終わってしまう人が少なくない、と感じています。
          </p>
          <p className="lede">
            DemoStageは、その打席をこちらで用意するための場です。
          </p>
        </div>

        <div className="ds" {...reveal(2)}>
          <div className="ds__lead">
            <p className="ds__name">
              DemoStage<span>デモステージ</span>
            </p>
            <p className="lede">
              関西の学生エンジニアが主役の、自作プロダクトのプレゼンと実機展示に特化したイベントです。
              株式会社ローカルイノベーションとの共同主催で、第1回を大阪で開催しました。
            </p>
            <p className="lede">
              学生が自分の手で動くものを持ち寄り、その場でコードを見せながら話す。
              そうした場を主催していることが、そのまま私たちの開発力の土台になっています。
            </p>
            <div className="ds__actions">
              <a
                className="btn btn--ghost"
                href={mediaUrl("/demostage-in-summer-report")}
              >
                開催レポートを読む
              </a>
              <a
                className="btn btn--ghost"
                href="https://career-select.connpass.com/event/394872/"
              >
                connpassのページ
              </a>
            </div>
          </div>

          <dl className="ds__facts">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>
                  {fact.detail}
                  {fact.tbd ? <span className="tbd"> {fact.tbd}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="ds__prog" {...reveal(3)}>
          {program.map((item) => (
            <li key={item.n}>
              <span className="ds__k">{item.n}</span>
              <span>
                <b>{item.title}</b>
                {item.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
