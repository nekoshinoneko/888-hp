import { Fragment } from "react";

import { reveal } from "@/components/motion/reveal";
import { companyProfile } from "@/content/site";

/**
 * フッター：会社概要＋社名の由来（トップページ構成 8）。
 *
 * 由来は「エンジニアやニコニコ動画の文化で8を連打して拍手を表す」。
 * 末広がり・縁起物として説明しない（指示書）。
 */
export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap site-foot__grid">
        <div>
          <p className="eyebrow">会社概要</p>
          <dl>
            {companyProfile.map((row) => (
              <Fragment key={row.label}>
                <dt>{row.label}</dt>
                <dd className={row.tbd ? "tbd" : undefined}>{row.value}</dd>
              </Fragment>
            ))}
          </dl>
        </div>

        <div className="origin" {...reveal()}>
          <p className="eyebrow">社名の由来</p>
          <p>
            エンジニアやニコニコ動画の文化では、発表が終わったあとに「8」を連打して拍手を表します。
            888
            はその歓声そのものです。関わってくれた全ての人から拍手をもらえる会社でありたい、という意思を社名に置いています。
          </p>
        </div>
      </div>
      <div className="wrap copyright">© 2026 888 Inc.</div>
    </footer>
  );
}
