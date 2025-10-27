import Link from "next/link";

import { AuthButtons } from "@/components/AuthButtons";
import { siteConfig } from "@/lib/siteConfig";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const normalizeAnchor = (href: string) => (href.startsWith("#") ? `/${href}` : href);

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-semibold">
            {siteConfig.brandMark}
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
          {siteConfig.navigation.map((item) => {
            const href = normalizeAnchor(item.href);
            const isContact = href === "/contact";
            if (isContact) {
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "border border-border text-foreground")}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <Link key={item.href} href={href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <AuthButtons />
        </div>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "md:hidden")}
        >
          お問い合わせ
        </Link>
      </div>
    </header>
  );
}
