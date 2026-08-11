import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-paper px-6 text-center">
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
    </div>
  );
}
