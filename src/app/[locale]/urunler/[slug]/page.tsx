import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {buildAlternates} from '@/lib/seo';
import {getProductBySlug, getProducts} from '@/data/products';
import {pick} from '@/data/types';
import {site} from '@/data/site';
import BottleVisual from '@/components/products/BottleVisual';

export async function generateStaticParams() {
  const products = await getProducts();
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({locale, slug: product.slug}))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const typedLocale = locale as Locale;
  // Başlık şablonu layout'ta "%s | Çankırı Gazozu" — metaTitle marka adını zaten
  // içerdiği için absolute veriliyor, yoksa marka iki kez yazılır.
  const title = pick(product.metaTitle, typedLocale);
  const description = pick(product.metaDescription, typedLocale);

  return {
    title: {absolute: title},
    description,
    alternates: buildAlternates(
      {pathname: '/urunler/[slug]', params: {slug: product.slug}},
      typedLocale
    ),
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: '/paylasim-gorseli.jpg',
          width: 1200,
          height: 630,
          alt: pick(product.imageAlt, typedLocale)
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/paylasim-gorseli.jpg']
    }
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations('products');
  const typedLocale = locale as Locale;

  // Çapraz bağlantı: her ürün sayfasından diğerlerine link (SEO iç link ağı)
  const otherProducts = (await getProducts()).filter(
    (item) => item.slug !== product.slug
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${site.name} ${pick(product.flavor, typedLocale)}`,
    description: pick(product.metaDescription, typedLocale),
    brand: {'@type': 'Brand', name: site.name},
    manufacturer: {'@id': `${site.url}/#organization`},
    category: 'Gazlı İçecek',
    material: 'Cam',
    image: product.image ? `${site.url}${product.image}` : undefined,
    // NOT: `offers` fiyat ve stok netleşmeden eklenmiyor — eksik offers
    // Search Console'da hata üretir.
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'flavor',
        value: pick(product.flavor, typedLocale)
      },
      {
        '@type': 'PropertyValue',
        name: 'packaging',
        value: pick(product.packaging, typedLocale)
      }
      // TODO(Yusuf): hacim doğrulanınca volume PropertyValue eklenecek.
    ]
  };

  return (
    <article className="bg-paper pt-28 pb-24 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />

      <div className="mx-auto grid max-w-5xl items-center gap-14 px-6 md:grid-cols-2">
        <div
          className="relative flex h-[420px] items-center justify-center rounded-3xl sm:h-[520px]"
          style={{background: `radial-gradient(circle, ${product.theme.glow}, transparent 68%)`}}
        >
          <BottleVisual product={product} locale={typedLocale} priority />
        </div>

        <div>
          <Link
            href="/urunler"
            className="text-sm font-medium text-muted underline-offset-4 hover:underline"
          >
            ← {t('backToProducts')}
          </Link>

          {product.badge && (
            <span
              className="mt-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wider text-paper uppercase"
              style={{background: product.theme.base}}
            >
              {pick(product.badge, typedLocale)}
            </span>
          )}

          <h1
            className="font-display mt-4 text-4xl font-bold text-balance sm:text-5xl"
            style={{color: product.theme.base}}
          >
            {pick(product.name, typedLocale)}
          </h1>
          <p className="mt-3 text-xl text-ink-2">
            {pick(product.tagline, typedLocale)}
          </p>
          <p className="mt-6 leading-relaxed text-ink-2">
            {pick(product.longDescription, typedLocale)}
          </p>

          {/* Hacim, koli adedi ve raf ömrü ambalajdan teyit alınmadan yayınlanmıyor.
              TODO(Yusuf): doğrulanan bilgiler geldiğinde bu listeye eklenecek. */}
          <dl className="mt-8 flex gap-10 border-t border-ink/10 pt-6 text-sm">
            <div>
              <dt className="text-xs tracking-wider text-muted uppercase">
                {t('flavorLabel')}
              </dt>
              <dd className="mt-1 font-semibold text-ink">
                {pick(product.flavor, typedLocale)}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wider text-muted uppercase">
                {t('packaging')}
              </dt>
              <dd className="mt-1 font-semibold text-ink">
                {pick(product.packaging, typedLocale)}
              </dd>
            </div>
          </dl>

          <nav className="mt-10 border-t border-ink/10 pt-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
              {t('otherProducts')}
            </p>
            <ul className="mt-4 space-y-3">
              {otherProducts.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={{
                      pathname: '/urunler/[slug]',
                      params: {slug: other.slug}
                    }}
                    className="group flex items-baseline gap-2 text-sm"
                  >
                    <span
                      className="font-semibold underline-offset-4 group-hover:underline"
                      style={{color: other.theme.base}}
                    >
                      {pick(other.name, typedLocale)}
                    </span>
                    <span className="text-muted">
                      — {pick(other.tagline, typedLocale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </article>
  );
}
