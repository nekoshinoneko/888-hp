/**
 * 流れる帯。adoor.inc の infiniteslide にあたるもので、CSSだけで動かす。
 *
 * 事実だけを並べる。実績の数字・料金・導入事例は入れない
 * （指示書「絶対に守ること > コピー」）。
 */

const WORDS = [
  "受託開発",
  "自社プロダクト開発",
  "技術イベントの企画運営",
  "AIで人手の作業を減らす",
  "要件の整理から運用まで",
  "DemoStage",
];

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {WORDS.map((word) => (
        <span className="marquee__item" key={word}>
          <span className="marquee__dot" />
          {word}
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee">
      {/* 2組並べて -50% 動かすと途切れずに繋がる。
          2組目は同じ文字なので読み上げから外す */}
      <div className="marquee__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
