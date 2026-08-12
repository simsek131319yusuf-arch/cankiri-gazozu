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
  const t = await getTranslations({locale, namespace: 'meta.contact'});
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: buildAlternates('/iletisim', locale as Locale),
    openGraph: {title, description, type: 'website'},
    twitter: {card: 'summary_large_image', title, description}
  };
}

export default async function ContactPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  // Adresin doğrulanmış parçaları; posta kodu boş olduğu için satır yazılmıyor.
  const addressLines = [
    site.address.street,
    site.address.locality,
    `${site.address.district} / ${site.address.city}`
  ].filter(Boolean);

  /**
   * DİKKAT: telefon ve sosyal medya hesapları HENÜZ DOĞRULANMADI (src/data/site.ts).
   * Boş değer arayüzde asla basılmaz; uydurma numara/hesap yazılmaz.
   */
  const socialEntries = (
    [
      ['Instagram', site.social.instagram],
      ['Facebook', site.social.facebook],
      ['YouTube', site.social.youtube]
    ] as const
  ).filter(([, href]) => Boolean(href));

  return (
    <div className="bg-paper pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-4xl px-6">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.35em] text-cornel uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">{t('lead')}</p>
        </header>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-ink/10 sm:grid-cols-2">
          {/* Adres */}
          <section className="bg-paper p-8">
            <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">
              {t('addressTitle')}
            </h2>
            <address className="mt-4 space-y-1 leading-relaxed text-ink not-italic">
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <a
              href={site.mapUrl}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cornel underline-offset-4 hover:underline"
            >
              {t('mapLink')}
              <span aria-hidden>↗</span>
            </a>
          </section>

          {/* E-posta */}
          <section className="bg-paper p-8">
            <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">
              {t('emailTitle')}
            </h2>
            <p className="mt-4">
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-ink underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </p>
          </section>

          {/* Telefon — numara doğrulanana kadar "yakında" metni gösteriliyor */}
          <section className="bg-paper p-8">
            <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">
              {t('phoneTitle')}
            </h2>
            {site.phone ? (
              <p className="mt-4">
                <a
                  href={`tel:${site.phone}`}
                  className="font-medium text-ink underline-offset-4 hover:underline"
                >
                  {site.phone}
                </a>
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted">{t('pending')}</p>
            )}
          </section>

          {/* Sosyal medya — hesaplar teyit edilmeden hiçbir bağlantı basılmıyor */}
          <section className="bg-paper p-8">
            <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">
              {t('socialTitle')}
            </h2>
            {socialEntries.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {socialEntries.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      className="font-medium text-ink underline-offset-4 hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">{t('pending')}</p>
            )}
          </section>
        </div>

        {/* Bayilik CTA'sı */}
        <section className="mt-14 flex flex-col items-start gap-6 rounded-3xl bg-ink p-8 sm:flex-row sm:items-center sm:p-12">
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-paper sm:text-3xl">
              {t('dealerTitle')}
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-paper/70">
              {t('dealerBody')}
            </p>
          </div>
          <Link
            href="/bayilik"
            className="shrink-0 rounded-full bg-gold px-8 py-4 font-bold text-ink transition hover:bg-paper"
          >
            {t('dealerButton')}
          </Link>
        </section>
      </div>
    </div>
  );
}
