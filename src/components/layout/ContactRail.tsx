/**
 * 縦軸のUI。adoor.inc が右端に置いている縦組みタブと、左端の進捗レール。
 *
 * 期待される横軸を外すと「手が込んでいる」信号になる、というだけの部品なので、
 * これが無くても導線は成立する（ヘッダーのCTAが本線）。
 * 1080px以下では出さない。狭い画面では本文を削るほうが損。
 *
 * 進捗の値は ScrollStage が <html> に書く --scroll-progress を読む。
 */
export function ContactRail() {
  return (
    <>
      <div className="rail-progress" aria-hidden="true">
        <div className="rail-progress__bar" />
        <div className="rail-progress__dot" />
      </div>

      {/* ヘッダーにも同じ導線があるので、こちらは補助。読み上げから外す */}
      <a className="rail-contact" href="#contact" aria-hidden="true" tabIndex={-1}>
        CONTACT
      </a>
    </>
  );
}
