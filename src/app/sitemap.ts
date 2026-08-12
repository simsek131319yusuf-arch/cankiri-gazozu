import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getProducts} from '@/data/products';
import {site} from '@/data/site';

type StaticHref = keyof typeof routing.pathnames;

/**
 * Statik sayfalar ve öncelikleri.
 *
 * Buradaki her yol src/i18n/routing.ts'te TANIMLI olmak zorunda — `StaticHref`
 * tipi bunu derleme zamanında zorluyor. Rotası olmayan bir yol yazılırsa
 * sitemap sessizce 404 üretmez, build patlar.
 *
 * ÖNCELİKLER: ana sayfa 1 → marka anlatısı 0.9/0.8 → ürün detay 0.7 →
 * destek sayfaları 0.6 → yasal metinler 0.2. Yasal sayfalar taranmasın diye
 * değil, "bu sayfa için sıralamak istemiyoruz" demek için düşük.
 */
const staticPages = [
  {href: '/', priority: 1},
  {href: '/hakkimizda', priority: 0.9},
  {href: '/hikayemiz', priority: 0.8},
  {href: '/urunler', priority: 0.8},
  {href: '/bayilik', priority: 0.8},
  {href: '/sss', priority: 0.6},
  {href: '/iletisim', priority: 0.6},
  // Yasal metinlerin gerçek bir güncellenme tarihi var (site.legalUpdatedAt),
  // bu yüzden lastModified'ı hak eden tek sayfalar bunlar.
  {href: '/gizlilik', priority: 0.2, lastModified: site.legalUpdatedAt},
  {href: '/kvkk', priority: 0.2, lastModified: site.legalUpdatedAt}
] as const satisfies ReadonlyArray<{
  href: StaticHref;
  priority: number;
  lastModified?: string;
}>;

/**
 * lastModified KARARI: eskiden tüm URL'lere `new Date()` yazılıyordu; her
 * build'de "bütün site az önce değişti" diyordu. Bu bilgi yanlış olduğu için
 * Google bir süre sonra alanı tamamen yok sayar — yani zararı, faydası olacağı
 * ana da mal olur.
 *
 * lastModified isteğe bağlı bir alan. Uydurma tarihten iyisi HİÇ tarih
 * vermemek. Bu yüzden yalnızca gerçekten takip edilen bir tarihi olan
 * sayfalar (yasal metinler → site.legalUpdatedAt) lastModified taşıyor.
 *
 * Ürün ve içerik sayfaları için içerik katmanında (src/data/*) bir
 * `updatedAt` alanı olmadığı sürece burada elle tarih tablosu tutmak
 * bakımsız kalmaya mahkûm — ilk unutulan güncellemede yine yalan söyler.
 * Admin paneline geçilince ürünlere updatedAt eklenip buraya bağlanmalı.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push({
      url: absolute(getPathname({href: page.href, locale: routing.defaultLocale})),
      ...('lastModified' in page ? {lastModified: page.lastModified} : {}),
      priority: page.priority,
      alternates: {
        languages: languagesFor(page.href)
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
      priority: 0.7,
      alternates: {
        languages: languagesFor(href)
      }
    });
  }

  return entries;
}

/** Her dil için mutlak URL — hreflang'in sitemap karşılığı */
function languagesFor(href: Parameters<typeof getPathname>[0]['href']) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, absolute(getPathname({href, locale}))])
  );
}

function absolute(pathname: string) {
  return `${site.url}${pathname === '/' ? '' : pathname}`;
}
