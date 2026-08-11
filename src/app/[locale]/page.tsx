import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
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

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Hero />
      <ProductShowcase locale={locale as Locale} />

      {/* Fabrika teaser — asıl SEO ağırlığı /hakkimizda sayfasında */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold tracking-[0.35em] text-classic uppercase">
            {t('about.eyebrow')}
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-5xl">
            {t('about.title')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-2">
            {t('about.body')}
          </p>
          <Link
            href="/hakkimizda"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink px-8 py-4 text-base font-semibold text-ink transition hover:bg-ink hover:text-paper"
          >
            {t('about.cta')}
            <span aria-hidden>→</span>
          </Link>
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
