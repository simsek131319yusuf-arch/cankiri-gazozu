import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getProducts} from '@/data/products';
import {site} from '@/data/site';

/** Statik sayfalar ve öncelikleri */
const staticPages = [
  {href: '/', priority: 1},
  {href: '/urunler', priority: 0.8},
  {href: '/hakkimizda', priority: 0.9},
  {href: '/bayilik', priority: 0.8}
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push({
      url: absolute(getPathname({href: page.href, locale: routing.defaultLocale})),
      lastModified,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            absolute(getPathname({href: page.href, locale}))
          ])
        )
      }
    });
  }

  for (const product of products) {
    const href = {
      pathname: '/urunler/[slug]' as const,
      params: {slug: product.slug}
    };
    entries.push({
      url: absolute(getPathname({href, locale: routing.defaultLocale})),
      lastModified,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            absolute(getPathname({href, locale}))
          ])
        )
      }
    });
  }

  return entries;
}

function absolute(pathname: string) {
  return `${site.url}${pathname === '/' ? '' : pathname}`;
}
