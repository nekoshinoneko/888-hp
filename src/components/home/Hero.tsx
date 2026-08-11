import { reveal } from "@/components/motion/reveal";

/**
 * 1. ファーストビュー
 * ビジョンを語る言葉で事業を言い切る。抽象コピーで終わらせない（指示書 1.3）。
 *
 * 見出しには .shine（光の帯／指示書 3.2）。is-shining はここに直接書く。
 * JSで後から付けない。fill-mode:both なので JS が動かなくても文字は読める状態で止まる。
 */
export function Hero() {
  return (
    <section className="hero wrap">
      <p className="eyebrow" {...reveal(0)}>
        SYSTEM DEVELOPMENT
      </p>

      <h1>
        <span className="shine is-shining">現場の手作業を、</span>
        <br />
        <span className="shine is-shining shine--d1">AIで減らす。</span>
      </h1>

      <p className="lede" {...reveal(1)}>
        紙とExcelで回っている業務は、まだいくらでもあります。
        <br />
        株式会社888は、その現場に入って動くシステムをつくる開発会社です。
      </p>

      <p className="hero__slogan" {...reveal(2)}>
        <b>すべてのステークホルダーから拍手をもらえる会社に。</b>
      </p>
    </section>
  );
}
