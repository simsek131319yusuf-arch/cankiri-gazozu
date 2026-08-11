'use client';

import {useParams} from 'next/navigation';
import {useLocale} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {locales} from '@/i18n/routing';

/**
 * Dil değiştirici. Bulunduğun sayfanın karşılığına gider — /urunler/kizilcikli-gazoz
 * İngilizce'de /en/products/kizilcikli-gazoz olur, ana sayfaya atmaz.
 */
export default function LanguageSwitcher({dark}: {dark?: boolean}) {
  const pathname = usePathname();
  const params = useParams();
  const active = useLocale();

  return (
    <div
      className={`flex items-center gap-1 rounded-full border p-0.5 text-xs font-semibold ${
        dark ? 'border-paper/25' : 'border-ink/15'
      }`}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          // @ts-expect-error -- dinamik segmentli yollarda params tipi runtime'da doğru
          href={{pathname, params}}
          locale={locale}
          hrefLang={locale}
          aria-current={locale === active ? 'true' : undefined}
          className={`rounded-full px-3 py-1.5 uppercase transition ${
            locale === active
              ? 'bg-cornel text-paper'
              : dark
                ? 'text-paper/70 hover:text-paper'
                : 'text-muted hover:text-ink'
          }`}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
