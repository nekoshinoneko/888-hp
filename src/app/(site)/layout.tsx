import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * 公開側（会社サイト）の共通レイアウト。
 * /admin はこれを通らないので、管理画面に会社サイトのヘッダーが出ることはない。
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
