import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

/** 404'te kullanıcıyı çıkmaz sokakta bırakmamak için popüler sayfalara link verilir. */
const popularLinks = [
  {href: '/urunler', key: 'products'},
  {href: '/hakkimizda', key: 'about'},
  {href: '/hikayemiz', key: 'story'},
  {href: '/bayilik', key: 'dealership'},
  {href: '/sss', key: 'faq'},
  {href: '/iletisim', key: 'contact'}
] as const;

export default function NotFound() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-paper px-6 py-24 text-center">
      <p className="font-display text-7xl font-bold text-cornel">404</p>
      <h1 className="font-display mt-4 text-3xl font-bold text-ink">
        {t('notFound')}
      </h1>
      <p className="mt-3 max-w-sm text-muted">{t('notFoundBody')}</p>

      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-8 py-4 font-semibold text-paper transition hover:bg-cornel"
      >
        {t('backHome')}
      </Link>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-ink-2">
        {popularLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="underline-offset-4 hover:underline">
              {tNav(link.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
