'use client';

import {useParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {locales} from '@/i18n/routing';

type AppPathname = ReturnType<typeof usePathname>;
type Params = ReturnType<typeof useParams>;

/**
 * Kanonik yolu, tipli Link'in beklediği href'e çevirir.
 *
 * next-intl'in href tipi dinamik segmenti olan rotalarda `params` ZORUNLU,
 * olmayanlarda ise YASAK. usePathname bütün rotaların birleşimini döndürdüğü
 * için tek bir `{pathname, params}` nesnesi hiçbir zaman tipe uymaz — eski
 * kodda @ts-expect-error bu yüzden vardı. Dinamik rotayı elle daraltınca
 * TypeScript her iki dalı da doğru çıkarıyor; hiçbir tip zorlaması kalmıyor.
 *
 * DİKKAT: routing.ts'e yeni bir dinamik rota (köşeli parantezli) eklenirse
 * buraya da bir dal eklenmeli, yoksa derleme hatası verir.
 */
function toHref(pathname: AppPathname, params: Params) {
  if (pathname === '/urunler/[slug]') {
    return {pathname, params: {slug: String(params.slug)}};
  }
  return pathname;
}

/**
 * Dil değiştirici. Bulunduğun sayfanın karşılığına gider — /urunler/kizilcikli-gazoz
 * İngilizce'de /en/products/kizilcikli-gazoz olur, ana sayfaya atmaz.
 */
export default function LanguageSwitcher({dark}: {dark?: boolean}) {
  const t = useTranslations('common');
  const pathname = usePathname();
  const params = useParams();
  const active = useLocale();

  const href = toHref(pathname, params);

  return (
    <div
      className={`flex items-center gap-1 rounded-full border p-0.5 text-xs font-semibold ${
        dark ? 'border-paper/25' : 'border-ink/15'
      }`}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={href}
          locale={locale}
          hrefLang={locale}
          aria-current={locale === active ? 'page' : undefined}
          // Kısaltma ("TR"/"EN") ekran okuyucuda tek başına anlamsız kalıyor;
          // erişilebilir ad "Dil: TR" biçiminde okunuyor.
          aria-label={`${t('language')}: ${locale.toUpperCase()}`}
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
