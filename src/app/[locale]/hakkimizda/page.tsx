import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
import FactoryBackdrop from '@/components/hero/FactoryBackdrop';

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
type Fact = {label: string; value: string};
type Quote = {text: string; author: string; role: string};

export default async function AboutPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about.page');
  const tNav = await getTranslations('nav');

  const sections = t.raw('sections') as Section[];
  const facts = t.raw('facts.items') as Fact[];
  const quotes = t.raw('quotes') as Quote[];

  return (
    <article className="bg-paper">
      {/* NOT: elde başka doğrulanmış fabrika fotoğrafı yok; aynı dış cephe karesi
          hero ve intro ile paylaşılıyor. Sayfanın ritmi tipografi ve yerleşimle
          kuruluyor, uydurma görsel eklenmiyor. */}
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden bg-night">
        {/* Geniş ve alçak bir şerit: burada kırpma dikeyde oluyor, dolayısıyla
            object-position işe yarıyor. Merkez hizası tepeleri gösteriyordu,
            alt bölgeye yaslayıp binayı kadraja alıyoruz. */}
        <FactoryBackdrop priority className="object-cover object-[50%_78%]" />
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

        {/* Tesisin künyesi — veri listesi olarak işaretlendi */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('facts.title')}
          </h2>
          <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <dt className="text-xs font-semibold tracking-[0.2em] text-muted uppercase sm:w-44 sm:shrink-0">
                  {fact.label}
                </dt>
                <dd className="font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Üretim hattı */}
        <section className="mt-16 rounded-3xl bg-paper-2 p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('line.title')}
          </h2>
          <p className="mt-4 leading-relaxed text-ink-2">{t('line.body')}</p>
        </section>

        {/* Açılışta söylenenler */}
        <div className="mt-16 space-y-10">
          {quotes.map((quote) => (
            <figure key={quote.author} className="border-l-4 border-cornel pl-6">
              <blockquote>
                <p className="font-display text-xl leading-relaxed text-ink text-balance sm:text-2xl">
                  “{quote.text}”
                </p>
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                <cite className="font-semibold text-ink-2 not-italic">
                  {quote.author}
                </cite>
                <span className="mx-2" aria-hidden>
                  ·
                </span>
                {quote.role}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Kapanış + iç linkler */}
        <section className="mt-16 border-t border-ink/10 pt-12">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('closing.title')}
          </h2>
          <p className="mt-4 leading-relaxed text-ink-2">{t('closing.body')}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/bayilik"
              className="inline-flex items-center gap-2 rounded-full bg-cornel px-8 py-4 font-semibold text-paper transition hover:bg-cornel-light hover:text-ink"
            >
              {t('closing.cta')}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/hikayemiz"
              className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
            >
              {tNav('story')}
            </Link>
            <Link
              href="/iletisim"
              className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
            >
              {tNav('contact')}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
