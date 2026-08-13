import { BlogSection } from "@/components/home/BlogSection";
import { Claim } from "@/components/home/Claim";
import { ContactSection } from "@/components/home/ContactSection";
import { EventSection } from "@/components/home/EventSection";
import { Fields } from "@/components/home/Fields";
import { HeroStage } from "@/components/home/HeroStage";
import { Marquee } from "@/components/home/Marquee";
import { Proof } from "@/components/home/Proof";
import { Opening } from "@/components/motion/Opening";

/**
 * トップページ。
 * ブロックの順序は指示書 1.3 の通りで、変えていない。
 *   1 ファーストビュー / 2 事業の言い切り / 3 技術力の根拠 / 4 取り組んでいる領域 /
 *   5 ブログ / 6 イベント事業 / 7 お問い合わせ / 8 フッター（layout.tsx）
 *
 * 1 に pin + scrub の演出を入れ、そこから本文へ渡す位置に流れる帯を1本置いた。
 * 帯は新しいブロックではなく、ステージと本文のあいだの継ぎ目。
 *
 * オープニングはトップページだけに出す（指示書 3.1）。
 */
export default function HomePage() {
  return (
    <>
      <Opening />
      <main>
        <HeroStage />
        <Marquee />
        <Claim />
        <Proof />
        <Fields />
        <BlogSection />
        <EventSection />
        <ContactSection />
      </main>
    </>
  );
}
