import { Logo888 } from "@/components/brand/Logo888";

/**
 * オープニングの幕（トップページのみ／指示書 3.1）。
 *
 * 幕を消すのはCSSアニメーションだけ。JSは一切関与しない。
 * JSが失敗しても画面が真っ白のまま戻らなくなることがない、という一点のためにこうしている。
 */
export function Opening() {
  return (
    <>
      <div className="opening" aria-hidden="true">
        <Logo888
          className="opening__logo"
          sparkClassName="opening__spark"
          withPlate={false}
          labelled={false}
        />
        <div className="opening__track">
          <div className="opening__bar" />
        </div>
      </div>
      {/* 「見た」の記録は幕を実際に出したページでだけ行う。
          この部品はトップページからしか呼ばれないので、URLの判定が要らない。 */}
      <script dangerouslySetInnerHTML={{ __html: markSeenScript }} />
    </>
  );
}

/**
 * JSの役割は「同一セッション内で2回目以降は出さない」判定だけ。幕を消す処理には関与しない。
 *
 * 読み取り側は <head> に置く。body の解析より前に <html> へクラスが付くので、
 * 2回目以降に幕が一瞬見えてから消える、という出方をしない。
 * 幕が無いページで付いても効き先が無いだけなので、ページの判定は不要。
 */
const readSeenScript = `try{
if(sessionStorage.getItem('888:opening-seen')){document.documentElement.classList.add('is-opening-seen')}
}catch(e){}`;

const markSeenScript = `try{sessionStorage.setItem('888:opening-seen','1')}catch(e){}`;

export function OpeningSeenScript() {
  return <script dangerouslySetInnerHTML={{ __html: readSeenScript }} />;
}
