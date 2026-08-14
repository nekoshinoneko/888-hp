import { Logo888 } from "@/components/brand/Logo888";

/**
 * 1. ファーストビュー
 *
 * 漫画のコマ割りを奥行きに置き換えたトンネル。
 * 読み込んだ直後は何も無く、スクロールを始めるとコマが奥から
 * 一枚ずつ手前へ流れてくる。抜けた先で公式ロゴが大きく着地する。
 *
 * ロゴが吹き出しで、社名は「8を連打して拍手する」＝パチパチパチ。
 * 漫画の語彙はこの会社の母語なので、借りものにならない。
 *
 * 締めのロゴは実ファイル（01_横長.svg）の写しである Logo888 を使う。
 * 影・縁取りを足さず、縦横比も変えない（指示書「絶対に守ること > ブランド」）。
 *
 * 地は白のまま。イエローは点と淡い下地までで、文字色にはしない。
 * 斜体は使わず、傾けたいところは rotate()（指示書2.2）。
 *
 * コマの中の写真はまだ無い。何を撮るべきかを書いた枠を置いてあり、
 * 素材が届いたら KOMA の photo に差し替える。
 * [要確認] 未確定#7／要件定義8「必要な素材」
 */

type Koma = {
  /** 奥行きの順番。0 が一番手前で、数字が大きいほど奥で待っている */
  i: number;
  /** 中心からの横ずれ（vw）。一列に並べず、左右に振って通り過ぎさせる */
  x: number;
  /** 中心からの縦ずれ（vh） */
  y: number;
  /** 傾き（deg）。手描きのコマのように少しだけ狂わせる */
  r: number;
  /** 枠に入れる写真の内容。届いたらここを実画像に差し替える */
  photo: string;
  /** コマのセリフ。短く。実績の数字は書かない */
  caption: string;
  /** 補助の一言 */
  note?: string;
};

const KOMA: Koma[] = [
  {
    i: 1,
    x: -34,
    y: -17,
    r: -3,
    photo: "紙とExcelで回っている現場",
    caption: "まず、現場を見に行く。",
  },
  {
    i: 2,
    x: 35,
    y: 14,
    r: 2.5,
    photo: "開発中の画面",
    caption: "動くものをつくって、そこで確かめる。",
  },
  {
    i: 3,
    x: -31,
    y: 20,
    r: 2,
    photo: "代表 篠原 晴哉",
    caption: "誰がつくっているかを出す。",
    note: "代表",
  },
  {
    i: 4,
    x: 33,
    y: -21,
    r: -2,
    photo: "在籍エンジニア",
    caption: "書いている人の顔と記事を並べる。",
    note: "メンバー",
  },
  {
    // 最後は正面から。ここでイベント事業に渡す
    i: 5,
    x: -4,
    y: -2,
    r: 1,
    photo: "DemoStage 当日",
    caption: "学生エンジニアの打席を、こっちで用意する。",
    note: "DemoStage",
  },
];

export function HeroStage() {
  return (
    <section className="stage" data-stage aria-label="株式会社888">
      <div className="stage__pin">
        <div className="focus focus--spin" aria-hidden="true" />

        <div className="corridor">
          {KOMA.map((k) => (
            <article
              className="koma"
              key={k.i}
              style={
                {
                  "--i": k.i,
                  "--x": k.x,
                  "--y": k.y,
                  "--r": k.r,
                } as React.CSSProperties
              }
            >
              <div className="koma__frame">
                {/* 写真が入る枠。いまは何を撮るかを書いてある */}
                <figure className="koma__slot">
                  <span className="koma__what">{k.photo}</span>
                  <span className="koma__todo">写真 要提供</span>
                </figure>
                <p className="koma__cap">
                  {k.caption}
                  {k.note ? <small>{k.note}</small> : null}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="stage__copy">
          {/* 締めは公式ロゴを大きく。ロゴ自体が吹き出しなので、
              さらに吹き出しで囲わない。8が3つ並ぶのもロゴが持っている。
              影や縁取りは足さず、縦横比も変えない（指示書）。 */}
          <Logo888 className="stage__logo" />

          <h1 className="stage__h1">
            {/* 見出しの光（指示書3.2）。is-shining はマークアップに直接書く。
                fill-mode:both なので、JSが動かなくても読める状態で止まる */}
            <span className="shine is-shining">現場の手作業を、</span>
            <span className="shine is-shining shine--d1">AIで減らす。</span>
          </h1>

          <p className="stage__lede">
            紙とExcelで回っている業務は、まだいくらでもあります。
            <br />
            株式会社888は、その現場に入って動くシステムをつくる開発会社です。
          </p>
        </div>

        <p className="stage__hint" aria-hidden="true">
          <span className="stage__hintLine" />
          SCROLL
        </p>
      </div>
    </section>
  );
}
