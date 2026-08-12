import {defineRouting} from 'next-intl/routing';

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'tr',
  // Türkçe kökte (/), İngilizce /en altında yaşar.
  localePrefix: 'as-needed',
  // DİKKAT: buraya eklenen her yol için src/app/[locale] altında gerçek bir
  // sayfa dosyası olmak zorunda. Rotası tanımlı ama sayfası olmayan yol,
  // Link ile gösterildiğinde 404 verir.
  pathnames: {
    '/': '/',
    '/urunler': {tr: '/urunler', en: '/products'},
    '/urunler/[slug]': {tr: '/urunler/[slug]', en: '/products/[slug]'},
    '/hakkimizda': {tr: '/hakkimizda', en: '/about'},
    '/hikayemiz': {tr: '/hikayemiz', en: '/our-story'},
    '/bayilik': {tr: '/bayilik', en: '/dealership'},
    '/sss': {tr: '/sss', en: '/faq'},
    '/iletisim': {tr: '/iletisim', en: '/contact'},
    '/gizlilik': {tr: '/gizlilik', en: '/privacy'},
    '/kvkk': {tr: '/kvkk', en: '/data-protection'}
  }
});
