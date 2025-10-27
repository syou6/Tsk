import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <Link href="/#matrix" className="hover:text-foreground">
            マトリクス
          </Link>
          <Link href="/#features" className="hover:text-foreground">
            機能
          </Link>
          <Link href="/#ai" className="hover:text-foreground">
            AI連携
          </Link>
          <Link href="/#roadmap" className="hover:text-foreground">
            ロードマップ
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            お問い合わせ
          </Link>
          <Link href="/legal/terms" className="hover:text-foreground">
            利用規約
          </Link>
          <Link href="/legal/privacy" className="hover:text-foreground">
            プライバシー
          </Link>
          <Link href="/legal/refund" className="hover:text-foreground">
            返金ポリシー
          </Link>
          <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-foreground">
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
