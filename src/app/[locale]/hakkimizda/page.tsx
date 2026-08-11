import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
import LayerVisual from '@/components/hero/LayerVisual';
import {heroLayers} from '@/data/hero';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta.about'});
  const title = t('title');
  const description = t('description');

  return {
    // Template eklenirse 62 karakteri aşıp arama sonucunda kesiliyor
    title: {absolute: title},
    description,
    alternates: buildAlternates('/hakkimizda', locale as Locale),
    openGraph: {title, description, type: 'website'},
    twitter: {card: 'summary_large_image', title, description}
  };
}

type Section = {heading: string; body: string};

export default async function AboutPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about.page');
  const tHero = await getTranslations('hero');
  const sections = t.raw('sections') as Section[];

  return (
    <article className="bg-paper">
      {/* Fabrika görseli — gerçek fotoğraf gelince hero.ts'teki factory katmanı dolar */}
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden bg-night">
        <LayerVisual layer={heroLayers[heroLayers.length - 1]} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-night/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-6 pb-10">
          <h1 className="font-display text-4xl font-bold text-paper text-balance sm:text-6xl">
            {t('title')}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="text-xl leading-relaxed text-ink-2">{t('lead')}</p>

        <div className="mt-14 space-y-12">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {section.heading}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-2">{section.body}</p>
            </section>
          ))}
        </div>

        <Link
          href="/bayilik"
          className="mt-14 inline-flex items-center gap-2 rounded-full bg-cornel px-8 py-4 font-semibold text-paper transition hover:bg-cornel-light hover:text-ink"
        >
          {tHero('cta')}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
