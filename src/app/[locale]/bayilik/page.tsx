import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
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

export default async function DealershipPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dealership');

  return (
    <div className="bg-paper pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-2xl px-6">
        <header className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-[0.35em] text-cornel uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-muted">{t('subtitle')}</p>
        </header>

        <div className="rounded-3xl border border-ink/10 bg-paper-2/50 p-6 sm:p-10">
          <DealerForm />
        </div>
      </div>
    </div>
  );
}
