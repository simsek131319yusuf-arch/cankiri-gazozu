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

  const [t, tp] = await Promise.all([
    getTranslations('products'),
    getTranslations('productPage')
  ]);
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
      },
      // Hacim yalnızca ambalajdan doğrulanmışsa şemaya girer; null iken
      // eklemek uydurma veri yayınlamak olur (DEVİR NOTU §1.5).
      ...(product.volumeMl
        ? [
            {
              '@type': 'PropertyValue',
              name: 'volume',
              value: product.volumeMl,
              unitCode: 'MLT'
            }
          ]
        : [])
    ]
  };

  return (
    <article className="bg-paper pt-32 pb-24 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />

      {/* items-stretch (varsayılan) bilerek korunuyor: şişe sütunu satır
          yüksekliğine uzamazsa içindeki sticky kutunun yol alacağı mesafe
          kalmaz. */}
      <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14">
        <div>
          {/* Şişe alanı mobilde kısa tutuluyor; masaüstünde metin akarken
              görünürde kalsın diye sticky. */}
          <div
            className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-ink/5 sm:h-[400px] md:sticky md:top-28 md:h-[520px]"
            style={{
              // Tek bir ham radial-gradient yerine katmanlı bir zemin: üstte
              // ürün renginden yumuşak bir ışık, altta şişeyi oturtan gölge.
              backgroundImage: [
                `radial-gradient(58% 46% at 50% 38%, ${product.theme.glow}, transparent 72%)`,
                `radial-gradient(120% 70% at 50% 112%, rgba(20,16,12,0.14), transparent 62%)`,
                'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(243,234,216,0.35))'
              ].join(', ')
            }}
          >
            <BottleVisual product={product} locale={typedLocale} priority />
          </div>
        </div>

        <div>
          {/* Geri bağlantısı ile rozet ayrı satırlarda: ikisi de satır içiyken
              üst üste biniyorlardı. */}
          <div>
            <Link
              href="/urunler"
              className="text-sm font-medium text-muted underline-offset-4 hover:underline"
            >
              ← {t('backToProducts')}
            </Link>
          </div>

          {product.badge && (
            <p className="mt-5">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wider text-paper uppercase"
                style={{background: product.theme.base}}
              >
                {pick(product.badge, typedLocale)}
              </span>
            </p>
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

          <section className="mt-10 border-t border-ink/10 pt-8">
            <h2
              className="font-display text-2xl font-bold"
              style={{color: product.theme.base}}
            >
              {tp('tasteTitle')}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              {pick(product.taste, typedLocale)}
            </p>
          </section>

          <section className="mt-8">
            <h2
              className="font-display text-2xl font-bold"
              style={{color: product.theme.base}}
            >
              {tp('pairingTitle')}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              {pick(product.pairing, typedLocale)}
            </p>
          </section>

          <section className="mt-10 border-t border-ink/10 pt-8">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
              {tp('infoTitle')}
            </h2>
            {/* Yalnızca DOĞRULANMIŞ alanlar listeleniyor. Hacim, koli adedi,
                raf ömrü ve besin değerleri ambalajdan teyit alınmadan
                yayınlanmıyor (DEVİR NOTU §1.5); eksikler pendingInfo notuyla
                açıkça söyleniyor — uydurma değer yazılmıyor. */}
            <dl className="mt-4 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="flex gap-6 py-3">
                <dt className="w-32 shrink-0 text-muted">{t('flavorLabel')}</dt>
                <dd className="font-semibold text-ink">
                  {pick(product.flavor, typedLocale)}
                </dd>
              </div>
              <div className="flex gap-6 py-3">
                <dt className="w-32 shrink-0 text-muted">{t('packaging')}</dt>
                {/* Hacim doğrulandığında ambalaj satırı "250 ml · cam şişe"
                    olarak zenginleşir; null iken yalnızca ambalaj yazar. */}
                <dd className="font-semibold text-ink">
                  {product.volumeMl
                    ? t('volume', {volume: product.volumeMl})
                    : pick(product.packaging, typedLocale)}
                </dd>
              </div>
              <div className="flex gap-6 py-3">
                <dt className="w-32 shrink-0 text-muted">
                  {tp('storageLabel')}
                </dt>
                <dd className="font-semibold text-ink">{tp('storageValue')}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {tp('pendingInfo')}
            </p>
          </section>

          <section
            className="mt-10 rounded-2xl border-t-4 bg-paper-2/70 p-6"
            style={{borderColor: product.theme.base}}
          >
            <h2 className="font-display text-xl font-bold text-ink">
              {tp('dealerCtaTitle')}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {tp('dealerCtaBody')}
            </p>
            <Link
              href="/bayilik"
              className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-paper transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              style={{
                background: product.theme.base,
                ['--tw-ring-color' as string]: product.theme.base
              }}
            >
              {tp('dealerCtaButton')}
              <span aria-hidden>→</span>
            </Link>
          </section>

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
