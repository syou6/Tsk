import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";
import { Button, buttonVariants } from "@/components/ui/button";

const normalizeAnchor = (href: string) => (href.startsWith("#") ? `/${href}` : href);

function Hero() {
  const { hero, highlights } = siteConfig;

  return (
    <section
      id="overview"
      className="border-b border-border bg-slate-50 scroll-mt-24"
    >
      <div className="section-shell flex flex-col items-center gap-12 py-20 text-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold text-foreground md:text-7xl">
            {hero.heading}
          </h1>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-xl">{hero.subheading}</p>
          {hero.badges?.length ? (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {hero.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="rounded-full">
            <Link href={normalizeAnchor(hero.primaryCta.href)}>{hero.primaryCta.label}</Link>
          </Button>
          <Link
            href={normalizeAnchor(hero.secondaryCta.href)}
            className={buttonVariants({ variant: "outline", size: "default" })}
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
        {highlights?.length ? (
          <div className="flex flex-wrap justify-center gap-4">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-background px-6 py-4 text-center shadow-sm"
              >
                <span className="text-3xl font-semibold text-foreground md:text-4xl">{item.value}</span>
                <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MatrixOverview() {
  const { matrix } = siteConfig;

  return (
    <section id="matrix" className="section-shell py-16 scroll-mt-24">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h2 className="text-4xl font-semibold text-foreground md:text-6xl">{matrix.title}</h2>
        <p className="text-base leading-7 text-muted-foreground md:text-xl">{matrix.description}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {matrix.quadrants.map((quadrant) => (
          <div
            key={quadrant.id}
            className="rounded-2xl border border-border bg-background p-6 shadow-sm"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              象限 {quadrant.id}
            </span>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">{quadrant.title}</h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{quadrant.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureGrid() {
  if (!siteConfig.features.length) return null;
  return (
    <section id="features" className="section-shell py-16 scroll-mt-24">
      <div className="grid gap-6 md:grid-cols-2">
        {siteConfig.features.map((feature, index) => (
          <div
            key={`${feature.title}-${index}`}
            className="rounded-xl border border-border bg-background p-6 shadow-sm"
          >
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AIWorkflow() {
  const { aiFlow } = siteConfig;
  return (
    <section id="ai" className="section-shell space-y-8 py-16 scroll-mt-24">
      <div className="max-w-3xl space-y-4">
        <h2 className="text-4xl font-semibold text-foreground md:text-6xl">{aiFlow.title}</h2>
        <p className="text-base text-muted-foreground md:text-xl">{aiFlow.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {aiFlow.steps.map((step) => (
          <div key={step} className="rounded-xl border border-border bg-background p-4 text-base text-muted-foreground">
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}

function UseCases() {
  if (!siteConfig.useCases?.length) return null;
  return (
    <section id="use-cases" className="section-shell space-y-8 py-16 scroll-mt-24">
      <div className="max-w-2xl space-y-3">
        <h2 className="text-4xl font-semibold text-foreground md:text-6xl">こんな人にフィットします</h2>
        <p className="text-base text-muted-foreground md:text-xl">
          役割や働き方ごとに EisenFlow の使い方を紹介します。
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {siteConfig.useCases.map((useCase, index) => (
          <div
            key={`${useCase.title}-${index}`}
            className="rounded-xl border border-border bg-background p-6 shadow-sm"
          >
            <h3 className="text-2xl font-semibold text-foreground">{useCase.title}</h3>
            <p className="mt-3 text-base text-muted-foreground">{useCase.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roadmap() {
  const { roadmap } = siteConfig;
  return (
    <section id="roadmap" className="section-shell space-y-8 py-16 scroll-mt-24">
      <div className="max-w-2xl space-y-3">
        <h2 className="text-4xl font-semibold text-foreground md:text-6xl">{roadmap.title}</h2>
        <p className="text-base text-muted-foreground md:text-xl">
          EisenFlow は MVP から継続的に拡張します。今後の予定を共有します。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {roadmap.items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {item.label}
            </span>
            <h3 className="mt-4 text-2xl font-semibold text-foreground">{item.headline}</h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{item.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  if (!siteConfig.faq?.length) return null;
  return (
    <section id="faq" className="section-shell space-y-6 py-16 scroll-mt-24">
      <h2 className="text-4xl font-semibold text-foreground md:text-6xl">FAQ</h2>
      <div className="space-y-4">
        {siteConfig.faq.map((item) => (
          <details key={item.question} className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <summary className="cursor-pointer text-base font-semibold text-foreground md:text-xl">
              {item.question}
            </summary>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="section-shell py-20">
      <div className="rounded-3xl border border-border bg-background px-10 py-12 text-center shadow-sm">
        <h2 className="text-3xl font-semibold text-foreground md:text-5xl">毎週の ship を EisenFlow で加速しよう</h2>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-xl">
          Indie Hacker のためにチューニングした AI マトリクスで、ローンチブロッカーと検証タスクを一目で把握。まずはベータに登録して、次のスプリントで試してみてください。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild className="rounded-full">
            <Link href="/auth/signup">ベータに参加する</Link>
          </Button>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "default" })}
          >
            インタビューを依頼する
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 space-y-0">
        <Hero />
        <MatrixOverview />
        <FeatureGrid />
        <AIWorkflow />
        <UseCases />
        <Roadmap />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
