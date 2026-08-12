import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
import {site} from '@/data/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta.privacy'});
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    // Yasal metinler arama sonuçlarında marka sayfalarının önüne geçmesin.
    // alternates yine de tanımlı: canonical mirası tehlikesi burada da geçerli.
    robots: {index: false, follow: true},
    alternates: buildAlternates('/gizlilik', locale as Locale),
    openGraph: {title, description, type: 'website'}
  };
}

type Section = {heading: string; body: string};

export default async function PrivacyPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const tNav = await getTranslations('nav');

  const sections = t.raw('privacy.sections') as Section[];

  // Tarih site.ts'te ISO tutuluyor, sayfanın diline göre biçimlendiriliyor.
  // timeZone UTC: yalnız tarihten oluşan ISO değeri yerel saatte bir gün kaymasın.
  const updated = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(site.legalUpdatedAt));

  return (
    <article className="bg-paper pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="font-display text-3xl font-bold text-ink text-balance sm:text-4xl">
          {t('privacy.title')}
        </h1>
        <p className="mt-3 text-sm text-muted">{t('updated', {date: updated})}</p>
        <p className="mt-8 text-lg leading-relaxed text-ink-2">
          {t('privacy.lead')}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-bold text-ink">
                {section.heading}
              </h2>
              <p className="mt-3 leading-8 text-ink-2">{section.body}</p>
            </section>
          ))}
        </div>

        <nav className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-8 text-sm font-semibold text-ink-2">
          <Link href="/kvkk" className="underline-offset-4 hover:underline">
            {t('kvkk.title')}
          </Link>
          <Link href="/iletisim" className="underline-offset-4 hover:underline">
            {tNav('contact')}
          </Link>
        </nav>
      </div>
    </article>
  );
}
