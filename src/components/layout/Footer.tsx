import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {site} from '@/data/site';

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="bg-ink text-paper/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold text-paper">
            Çankırı Gazozu
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
              <Link href="/bayilik" className="hover:text-paper">
                {t('nav.dealership')}
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
        </div>
      </div>

      <div className="border-t border-paper/10 px-6 py-6">
        <p className="mx-auto max-w-6xl text-xs">
          © {new Date().getFullYear()} {site.name}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
