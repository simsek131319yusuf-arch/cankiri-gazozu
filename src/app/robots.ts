import type {MetadataRoute} from 'next';
import {site} from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  // Vercel önizleme dağıtımları indekslenmesin — aynı içerik iki alan adında
  // görünürse Google hangisinin asıl olduğunu bilemez.
  const isProduction = process.env.VERCEL_ENV === 'production';

  return {
    rules: isProduction
      ? {userAgent: '*', allow: '/'}
      : {userAgent: '*', disallow: '/'},
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url
  };
}
