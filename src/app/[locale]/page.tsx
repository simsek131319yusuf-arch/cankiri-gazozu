import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
import {getProductBySlug} from '@/data/products';
import {pick} from '@/data/types';
import Hero from '@/components/hero/Hero';
import ProductShowcase from '@/components/products/ProductShowcase';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return {alternates: buildAlternates('/', locale as Locale)};
}

type Point = {title: string; body: string};
type Stat = {value: string; label: string};
type Step = {title: string; body: string};

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations();

  const whyGlassParagraphs = t.raw('home.whyGlass.paragraphs') as string[];
  const whyGlassPoints = t.raw('home.whyGlass.points') as Point[];
  const factoryStats = t.raw('home.factory.stats') as Stat[];
  const factorySteps = t.raw('home.factory.steps') as Step[];

  // Ana sayfadan kızılcık sayfasına ikinci iç link (birincisi ürün vitrininde).
  // Ürün adı yalnızca getProductBySlug üzerinden okunuyor — DEVIR-NOTU §1.1.
  const cornel = await getProductBySlug('kizilcik-gazozu');

  return (
    <>
      <Hero />
      <ProductShowcase locale={typedLocale} />

      {/* Neden cam şişe? — markanın en ayırt edici tercihini anlatan bölüm */}
      <section className="bg-ink py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-20">
            <div>
              <p className="text-sm font-semibold tracking-[0.35em] text-gold uppercase">
                {t('home.whyGlass.eyebrow')}
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-paper text-balance sm:text-5xl">
                {t('home.whyGlass.title')}
              </h2>
              {/* Şişe siluetini andıran ince altın çizgi — dekoratif */}
              <div
                className="mt-8 h-px w-24 bg-gradient-to-r from-gold to-transparent"
                aria-hidden
              />
            </div>

            <div className="space-y-6">
              {whyGlassParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg leading-relaxed text-paper/75"
                >
                  {paragraph}
                </p>
              ))}

              {cornel && (
                <p>
                  <Link
                    href={{
                      pathname: '/urunler/[slug]',
                      params: {slug: cornel.slug}
                    }}
                    className="inline-flex items-center gap-2 font-semibold text-cornel-light underline-offset-4 hover:underline"
                  >
                    {t('products.detail', {
                      name: pick(cornel.name, typedLocale)
                    })}
                    <span aria-hidden>→</span>
                  </Link>
                </p>
              )}
            </div>
          </div>

          <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-paper/10 sm:grid-cols-3">
            {whyGlassPoints.map((point) => (
              <li key={point.title} className="bg-ink p-8">
                <h3 className="font-display text-xl font-bold text-paper">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fabrika teaser — asıl SEO ağırlığı /hakkimizda sayfasında */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.35em] text-classic uppercase">
              {t('about.eyebrow')}
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-5xl">
              {t('about.title')}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-ink-2">
              {t('about.body')}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
              <span aria-hidden>◉</span>
              {t('home.factory.locationLabel')}
            </p>
          </div>

          {/* Doğrulanmış rakamlar — kaynak: SEO metinleri, tesis künyesi */}
          <dl className="mt-14 grid gap-8 border-y border-ink/10 py-10 sm:grid-cols-3">
            {factoryStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display block text-4xl font-bold text-classic sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-sm text-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {/* Üç adımlık üretim anlatısı */}
          <ol className="mt-14 grid gap-8 sm:grid-cols-3">
            {factorySteps.map((step, index) => (
              <li key={step.title} className="relative pl-14">
                <span
                  className="font-display absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full bg-classic text-base font-bold text-paper"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-8 py-4 text-base font-semibold text-ink transition hover:bg-ink hover:text-paper"
            >
              {t('home.factory.cta')}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/hikayemiz"
              className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
            >
              {t('nav.story')}
            </Link>
            <Link
              href="/sss"
              className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
            >
              {t('nav.faq')}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold text-paper sm:text-4xl">
              {t('dealership.title')}
            </h2>
            <p className="mt-3 max-w-lg text-paper/70">
              {t('dealership.subtitle')}
            </p>
          </div>
          <Link
            href="/bayilik"
            className="shrink-0 rounded-full bg-gold px-8 py-4 text-base font-bold text-ink transition hover:bg-paper"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
