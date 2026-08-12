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
  const t = await getTranslations({locale, namespace: 'meta.faq'});
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: buildAlternates('/sss', locale as Locale),
    openGraph: {title, description, type: 'website'},
    twitter: {card: 'summary_large_image', title, description}
  };
}

type Item = {question: string; answer: string};

export default async function FaqPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('faq');
  const tNav = await getTranslations('nav');

  const items = t.raw('items') as Item[];

  /**
   * FAQPage şeması. DİKKAT: buradaki soru/cevap metinleri aşağıdaki HTML ile
   * BİREBİR aynı kaynaktan (messages) okunuyor. Şemadaki metin sayfada
   * görünmezse Google bunu yapısal veri ihlali sayar — bu yüzden cevaplar
   * <details> içinde, JavaScript olmadan da HTML'de mevcut.
   */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <div className="bg-paper pt-32 pb-24 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />

      <div className="mx-auto max-w-3xl px-6">
        <header>
          <p className="text-sm font-semibold tracking-[0.35em] text-cornel uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-ink-2">{t('lead')}</p>
        </header>

        <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <details key={item.question} className="group py-5" open>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                  {item.question}
                </h2>
                <span
                  className="mt-1 shrink-0 text-xl leading-none text-cornel transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 pr-10 leading-relaxed text-ink-2">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <section className="mt-16 rounded-3xl bg-paper-2 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('cta.title')}
          </h2>
          <p className="mt-3 text-ink-2">{t('cta.body')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-semibold text-paper transition hover:bg-cornel"
            >
              {t('cta.button')}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/bayilik"
              className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
            >
              {tNav('dealership')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
