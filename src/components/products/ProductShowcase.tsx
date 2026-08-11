import {getTranslations} from 'next-intl/server';
import {getProducts} from '@/data/products';
import type {Locale} from '@/i18n/routing';
import ProductCard from './ProductCard';

/**
 * Ürün vitrini. Veriyi yalnızca getProducts() üzerinden okur — admin paneli
 * geldiğinde bu dosyaya dokunulmaz.
 *
 * `as` prop'u başlık seviyesini belirler: ana sayfada h2 (H1 hero'da),
 * /urunler kategori sayfasında h1. Her sayfada tek H1 olmalı.
 */
export default async function ProductShowcase({
  locale,
  as = 'h2'
}: {
  locale: Locale;
  as?: 'h1' | 'h2';
}) {
  const [products, t] = await Promise.all([
    getProducts(),
    getTranslations({locale, namespace: 'products'})
  ]);

  const isCategoryPage = as === 'h1';
  const Heading = as;

  return (
    <section
      id="urunler"
      className="relative overflow-hidden bg-paper py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-16 text-center">
          <p className="text-sm font-semibold tracking-[0.35em] text-cornel uppercase">
            {t('eyebrow')}
          </p>
          <Heading className="font-display mt-4 text-4xl font-bold text-ink text-balance sm:text-5xl">
            {isCategoryPage ? t('categoryTitle') : t('title')}
          </Heading>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            {isCategoryPage ? t('categoryIntro') : t('subtitle')}
          </p>
        </header>

        <div className="grid items-start gap-10 md:grid-cols-3 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
