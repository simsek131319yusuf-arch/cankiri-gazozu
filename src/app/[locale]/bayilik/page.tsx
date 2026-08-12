import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
import {site} from '@/data/site';
import DealerForm from '@/components/forms/DealerForm';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta.dealership'});
  const title = t('title');
  const description = t('description');

  return {
    title: {absolute: title},
    description,
    alternates: buildAlternates('/bayilik', locale as Locale),
    openGraph: {title, description, type: 'website'},
    twitter: {card: 'summary_large_image', title, description}
  };
}

type Argument = {title: string; body: string};
type Step = {title: string; body: string};
type FaqItem = {question: string; answer: string};

export default async function DealershipPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dealership');

  const whyItems = t.raw('why.items') as Argument[];
  const processSteps = t.raw('process.steps') as Step[];
  const faqItems = t.raw('faq.items') as FaqItem[];

  return (
    <div className="bg-paper pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-4xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.35em] text-cornel uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-muted">{t('subtitle')}</p>
        </header>

        {/* Satış argümanları — ticari güven içeriği */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('why.title')}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {whyItems.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-ink/10 bg-paper-2/40 p-6"
              >
                <h3 className="font-display text-lg font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Faaliyet bölgeleri — il listesi src/data/site.ts'ten okunuyor */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('regions.title')}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {site.activeRegions.map((region) => (
              <li
                key={region}
                className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink-2"
              >
                {region}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">{t('regions.note')}</p>
        </section>

        {/* Başvurudan sonraki süreç */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('process.title')}
          </h2>
          <ol className="mt-8 space-y-8 border-l-2 border-ink/10 pl-8">
            {processSteps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  className="font-display absolute top-0 -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-cornel text-sm font-bold text-paper"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Başvuru formu — bileşenin içine dokunulmuyor */}
        <section className="mt-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
              {t('form.title')}
            </h2>
            <div className="mt-8 rounded-3xl border border-ink/10 bg-paper-2/50 p-6 sm:p-10">
              <DealerForm />
            </div>
          </div>
        </section>

        {/* Bayilik SSS — cevaplar JS olmadan da HTML'de görünür */}
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('faq.title')}
          </h2>
          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-5" open>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                  <h3 className="font-display text-base font-bold text-ink sm:text-lg">
                    {item.question}
                  </h3>
                  <span
                    className="mt-0.5 shrink-0 text-xl leading-none text-cornel transition-transform group-open:rotate-45"
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
        </section>

        {/* Formu doldurmak istemeyenler için alternatif kanal */}
        <section className="mt-20 rounded-3xl bg-paper-2 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {t('alt.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-2">
            {t('alt.body')}
          </p>
          <p className="mt-6">
            <a
              href={`mailto:${site.email}`}
              className="font-display text-lg font-bold text-cornel underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
