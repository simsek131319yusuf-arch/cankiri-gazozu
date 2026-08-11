import {defineRouting} from 'next-intl/routing';

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'tr',
  // Türkçe kökte (/), İngilizce /en altında yaşar.
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/urunler': {tr: '/urunler', en: '/products'},
    '/urunler/[slug]': {tr: '/urunler/[slug]', en: '/products/[slug]'},
    '/hakkimizda': {tr: '/hakkimizda', en: '/about'},
    '/bayilik': {tr: '/bayilik', en: '/dealership'},
    '/iletisim': {tr: '/iletisim', en: '/contact'}
  }
});
