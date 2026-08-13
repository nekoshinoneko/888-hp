/**
 * 1. ファーストビュー
 *
 * 動きの仕組みは adoor.inc から取っている（pin + scrub、触る前から動いている）。
 * ただし比喩は差し替えた。あちらの「奥へ飛ぶトンネル」はあちらの世界観で、
 * 888 のロゴは「8を連打して拍手する」歓声のマーク。
 * なので中心の3点から拍手が外へ広がる形にしている。
 *
 * - 波紋はロゴの吹き出しと同じ丸みの矩形。中心から連続で外へ抜ける＝連打
 * - 中央の ● ● ● は仮サムネイル（thumb-*.svg）が使っているブランド自身の略記。
 *   中央だけがイエロー。拍手のリズムで順に弾む
 * - 地は白のまま。イエローは点にしか使わない（指示書2.1・受け入れ基準）
 *
 * 高さ（--stage-scroll）は2画面分に留めている。adoorは15,000px使っているが、
 * 名刺QRから来た人が「何の会社か」を知るまでに待たされてはいけないため。
 */

const RING_COUNT = 8;

export function HeroStage() {
  return (
    <section className="stage" data-stage aria-label="株式会社888">
      <div className="stage__pin">
        <div className="burst" aria-hidden="true">
          {Array.from({ length: RING_COUNT }, (_, i) => (
            <div
              key={i}
              className={`burst__ring${i % 3 === 0 ? " is-lit" : ""}`}
              style={{ ["--i" as string]: i }}
            />
          ))}
        </div>

        <div className="stage__copy">
          {/* 社名の由来そのもの。8が3つ並び、中央だけが色を持つ。
              見出しと同じ流れの中に置いて、間隔を絶対値で調整しない */}
          <p className="clap" aria-hidden="true">
            <span />
            <span />
            <span />
          </p>
          <p className="stage__eyebrow">SYSTEM DEVELOPMENT</p>
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
