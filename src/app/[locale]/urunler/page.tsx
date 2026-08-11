import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
import ProductShowcase from '@/components/products/ProductShowcase';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta.products'});
  const title = t('title');
  const description = t('description');

  return {
    // Başlık marka adını zaten içeriyor — template ikinci kez eklemesin.
    title: {absolute: title},
    description,
    alternates: buildAlternates('/urunler', locale as Locale),
    openGraph: {title, description, type: 'website'},
    twitter: {card: 'summary_large_image', title, description}
  };
}

export default async function ProductsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20">
      {/* Kategori sayfasında başlık H1 olmalı — ana sayfada aynı bileşen h2 basıyor */}
      <ProductShowcase locale={locale as Locale} as="h1" />
    </div>
  );
}
