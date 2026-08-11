import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Sayfaya özel canonical + hreflang üretir.
 *
 * DİKKAT: bunu her sayfada çağırmak zorunludur. Next.js'te layout'ta tanımlanan
 * `alternates` alt sayfalara miras kalır; tanımlamayan her sayfa kendini ana
 * sayfanın kopyası olarak işaretler ve indekslenmez.
 */
export function buildAlternates(href: Href, locale: Locale): Metadata['alternates'] {
  const languages = Object.fromEntries(
    routing.locales.map((item) => [item, getPathname({href, locale: item})])
  );

  return {
    canonical: getPathname({href, locale}),
    languages: {...languages, 'x-default': getPathname({href, locale: routing.defaultLocale})}
  };
}
