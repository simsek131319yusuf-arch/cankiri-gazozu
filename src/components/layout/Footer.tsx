import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {site} from '@/data/site';

export default async function Footer() {
  const t = await getTranslations();

  /**
   * DİKKAT: telefon ve sosyal medya hesapları HENÜZ DOĞRULANMADI
   * (src/data/site.ts). Boş değerler burada hiç basılmaz; alanlar dolunca
   * kendiliğinden görünür. Uydurma numara/hesap yazılmaz.
   */
  const socialEntries = (
    [
      ['Instagram', site.social.instagram],
      ['Facebook', site.social.facebook],
      ['YouTube', site.social.youtube]
    ] as const
  ).filter(([, href]) => Boolean(href));

  return (
    <footer className="bg-ink text-paper/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-paper">
            Çankırı Gazozu
          </p>
          {/* Marka sloganı — hero ile aynı kaynaktan okunuyor ki iki yerde
              ayrı ayrı güncellenmek zorunda kalmasın. */}
          <p className="font-display mt-2 text-base font-semibold text-gold">
            {t('hero.slogan')}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
            {t('footer.quickLinks')}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/urunler" className="hover:text-paper">
                {t('nav.products')}
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="hover:text-paper">
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link href="/hikayemiz" className="hover:text-paper">
                {t('nav.story')}
              </Link>
            </li>
            <li>
              <Link href="/bayilik" className="hover:text-paper">
                {t('nav.dealership')}
              </Link>
            </li>
            <li>
              <Link href="/sss" className="hover:text-paper">
                {t('nav.faq')}
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-paper">
                {t('nav.contact')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
            {t('footer.contact')}
          </p>
          <address className="mt-4 space-y-2 text-sm not-italic">
            <p>{t('footer.address')}</p>
            <p>
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener"
                className="hover:text-paper"
              >
                {t('footer.mapLink')} <span aria-hidden>↗</span>
              </a>
            </p>
            {site.phone && (
              <p>
                <a href={`tel:${site.phone}`} className="hover:text-paper">
                  {site.phone}
                </a>
              </p>
            )}
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-paper">
                {site.email}
              </a>
            </p>
          </address>

          {socialEntries.length > 0 && (
            <>
              <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-gold uppercase">
                {t('footer.social')}
              </p>
              <ul className="mt-3 flex flex-wrap gap-4 text-sm">
                {socialEntries.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      className="hover:text-paper"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
            {t('footer.legal')}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/gizlilik" className="hover:text-paper">
                {t('footer.privacy')}
              </Link>
            </li>
            <li>
              <Link href="/kvkk" className="hover:text-paper">
                {t('footer.kvkk')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10 px-6 py-6">
        <p className="mx-auto max-w-6xl text-xs">
          © {new Date().getFullYear()} {site.legalName}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
