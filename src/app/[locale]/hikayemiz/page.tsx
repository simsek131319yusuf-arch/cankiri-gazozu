import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta.story'});
  const title = t('title');
  const description = t('description');

  return {
    // Başlık marka adını zaten içeriyor; template ile iki kez yazılmasın
    title: {absolute: title},
    description,
    alternates: buildAlternates('/hikayemiz', locale as Locale),
    openGraph: {title, description, type: 'article'},
    twitter: {card: 'summary_large_image', title, description}
  };
}

type Section = {heading: string; body: string};
type Quote = {text: string; author: string; role: string};
type Milestone = {year: string; title: string; body: string};

export default async function StoryPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('story');
  const tNav = await getTranslations('nav');

  const sections = t.raw('sections') as Section[];
  const quotes = t.raw('quotes') as Quote[];
  const milestones = t.raw('timeline.items') as Milestone[];

  return (
    <article className="bg-paper pt-32 pb-24 sm:pt-40">
      <header className="mx-auto max-w-3xl px-6">
        <p className="text-sm font-semibold tracking-[0.35em] text-cornel uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-8 text-xl leading-relaxed text-ink-2">{t('lead')}</p>
      </header>

      <div className="mx-auto mt-16 max-w-3xl px-6">
        <div className="space-y-14">
          {sections.map((section, index) => {
            // Alıntılar metnin arasına serpiştiriliyor: 1. bölümden sonra ilk,
            // 3. bölümden sonra ikinci alıntı. Metin blok blok nefes alsın.
            const quote = index === 0 ? quotes[0] : index === 2 ? quotes[1] : null;

            return (
              <div key={section.heading} className="space-y-14">
                <section>
                  <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                    {section.heading}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-ink-2">
                    {section.body}
                  </p>
                </section>

                {quote && (
                  <figure className="rounded-3xl bg-ink px-8 py-10 sm:px-12">
                    <blockquote>
                      <p className="font-display text-2xl leading-relaxed text-paper text-balance sm:text-3xl">
                        “{quote.text}”
                      </p>
                    </blockquote>
                    <figcaption className="mt-6 text-sm text-paper/60">
                      <cite className="font-semibold text-gold not-italic">
                        {quote.author}
                      </cite>
                      <span className="mx-2" aria-hidden>
                        ·
                      </span>
                      {quote.role}
                    </figcaption>
                  </figure>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zaman çizelgesi — markanın en değerli içeriği, görsel olarak öne çıkıyor */}
      <section className="mt-24 bg-paper-2 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {t('timeline.title')}
          </h2>

          <ol className="mt-12 space-y-12 border-l-2 border-ink/10 pl-8 sm:pl-12">
            {milestones.map((item) => (
              <li key={item.year} className="relative">
                {/* Çizgi üzerindeki nokta */}
                <span
                  className="absolute top-2 -left-[41px] h-4 w-4 rounded-full border-4 border-paper-2 bg-cornel sm:-left-[57px]"
                  aria-hidden
                />
                <p className="font-display text-sm font-bold tracking-[0.2em] text-cornel uppercase">
                  {item.year}
                </p>
                <h3 className="font-display mt-2 text-xl font-bold text-ink sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-2">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Kapanış — fabrika sayfasına yönlendirme */}
      <section className="mx-auto mt-20 max-w-3xl px-6">
        <div className="rounded-3xl border border-ink/10 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-2">
            {t('cta.body')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-semibold text-paper transition hover:bg-cornel"
            >
              {t('cta.button')}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/urunler"
              className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
            >
              {tNav('products')}
            </Link>
            <Link
              href="/sss"
              className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
            >
              {tNav('faq')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
