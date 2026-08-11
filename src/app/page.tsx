import { BlogSection } from "@/components/home/BlogSection";
import { Claim } from "@/components/home/Claim";
import { ContactSection } from "@/components/home/ContactSection";
import { EventSection } from "@/components/home/EventSection";
import { Fields } from "@/components/home/Fields";
import { Hero } from "@/components/home/Hero";
import { Proof } from "@/components/home/Proof";
import { Opening } from "@/components/motion/Opening";

/**
 * トップページ。
 * ブロックの順序は指示書 1.3 の通りで、変えない。
 *   1 ファーストビュー / 2 事業の言い切り / 3 技術力の根拠 / 4 取り組んでいる領域 /
 *   5 ブログ / 6 イベント事業 / 7 お問い合わせ / 8 フッター（layout.tsx）
 *
 * オープニングはトップページだけに出す（指示書 3.1）。
 */
export default function HomePage() {
  return (
    <>
      <Opening />
      <main>
        <Hero />
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
