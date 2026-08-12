import type {MetadataRoute} from 'next';
import {site} from '@/data/site';

/**
 * Sitenin indekslenip indekslenmeyeceğine karar verir.
 *
 * ESKİ MANTIK HATALIYDI: yalnızca `VERCEL_ENV === 'production'` üretim
 * sayılıyordu. Site Vercel dışına (kendi sunucu, Coolify, Netlify, Docker…)
 * çıkarsa VERCEL_ENV hiç tanımlı olmaz ve robots.txt sessizce
 * `Disallow: /` yayınlar — yani site canlıdır ama Google'a kapalıdır.
 * Kimse hata görmez, sadece hiç trafik gelmez.
 *
 * YENİ MANTIK — sırayla:
 *   1. Açık bayrak varsa ona uy. Kararı deploy ortamı verir, tahmin yok.
 *      SITE_INDEXABLE=0 → kapat, =1 → aç. (Sunucu tarafında okunuyor;
 *      NEXT_PUBLIC_ öneki gerekmez ama bir platformda kolaylık olsun diye
 *      o da kabul ediliyor.)
 *   2. Bayrak yoksa ve VERCEL_ENV TANIMLIYSA: Vercel'deyiz demektir;
 *      yalnızca 'production' indekslenir, preview/development kapalı.
 *      (Önizleme URL'leri aynı içeriği ikinci bir alan adında yayınlar,
 *      Google hangisinin asıl olduğunu bilemez.)
 *   3. VERCEL_ENV yoksa: Vercel dışı bir ortamdayız. NODE_ENV'e güven —
 *      production build ise indekslenebilir kabul et. "Vercel dışı üretim"
 *      artık kazara engellenmiyor; kapatmak isteyen SITE_INDEXABLE=0 verir.
 */
function isIndexable(): boolean {
  const flag = process.env.SITE_INDEXABLE ?? process.env.NEXT_PUBLIC_SITE_INDEXABLE;
  if (flag != null && flag.trim() !== '') {
    return ['1', 'true', 'yes', 'on'].includes(flag.trim().toLowerCase());
  }

  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) {
    return vercelEnv === 'production';
  }

  return process.env.NODE_ENV === 'production';
}

export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexable();

  return {
    rules: indexable ? {userAgent: '*', allow: '/'} : {userAgent: '*', disallow: '/'},
    // Kapalı ortamda sitemap/host yayınlamanın anlamı yok; üstelik önizleme
    // alan adını asıl alan adı gibi göstermek yanlış sinyaldir.
    sitemap: indexable ? `${site.url}/sitemap.xml` : undefined,
    host: indexable ? site.url : undefined
  };
}
