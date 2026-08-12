import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {site} from '@/data/site';

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

/** Kırıntı yolundaki tek bir basamak */
type Crumb = {
  /** Kullanıcıya görünen ad — sayfanın çeviri anahtarından gelmeli */
  name: string;
  /**
   * Rota. routing.ts'te tanımlı olmayan bir yol yazılamaz (tip hatası verir).
   * Son basamak (sayfanın kendisi) için de verilmeli; Google son öğede
   * `item` beklemez ama vermek zarar değil, üstelik hepsi tek biçim kalır.
   */
  href: Href;
};

/**
 * BreadcrumbList JSON-LD üretir — arama sonucunda URL yerine
 * "Çankırı Gazozu › Ürünler › Kızılcık Gazozu" yolunu gösterir.
 *
 * Nesneyi döndürür, script etiketini DÖNDÜRMEZ; çağıran sayfa şöyle basar:
 *
 *   const crumbs = buildBreadcrumbs(locale, [
 *     {name: t('breadcrumb.home'), href: '/'},
 *     {name: t('breadcrumb.products'), href: '/urunler'},
 *     {name: product.name[locale], href: {pathname: '/urunler/[slug]', params: {slug}}}
 *   ]);
 *
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{__html: JSON.stringify(crumbs)}}
 *   />
 *
 * DİKKAT: `name` değerleri sayfadaki görünür kırıntı/başlıklarla aynı olmalı.
 * Yapısal veride sayfada olmayan bir yol göstermek Google için ihlaldir.
 */
export function buildBreadcrumbs(locale: Locale, crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      // Mutlak URL zorunlu: göreli yol verilirse Google öğeyi yok sayar.
      item: absoluteUrl(getPathname({href: crumb.href, locale}))
    }))
  };
}

function absoluteUrl(pathname: string) {
  return `${site.url}${pathname === '/' ? '' : pathname}`;
}
