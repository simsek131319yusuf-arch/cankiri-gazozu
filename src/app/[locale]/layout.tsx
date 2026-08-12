import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Figtree, Bricolage_Grotesque} from 'next/font/google';
import {routing, type Locale} from '@/i18n/routing';
import {site} from '@/data/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrganizationSchema from '@/components/seo/OrganizationSchema';
import '../globals.css';

const body = Figtree({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap'
});

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta.home'});

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t('title'),
      template: `%s | ${site.name}`
    },
    description: t('description'),
    // canonical/hreflang BİLEREK burada tanımlanmıyor: layout metadata'sı alt
    // sayfalara miras kalır ve hepsi ana sayfayı canonical gösterirdi.
    // Her sayfa kendi alternates'ini buildAlternates() ile veriyor.
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/paylasim-gorseli.jpg',
          width: 1200,
          height: 630,
          alt: 'Çankırı Gazozu — cam şişede kızılcık, klasik ve portakal'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/paylasim-gorseli.jpg']
    },
    // icons BİLEREK YOK: ikonlar Next dosya konvansiyonuyla veriliyor
    // (src/app/icon.png 32x32, src/app/apple-icon.png 180x180). Next bu
    // dosyalar için <link rel="icon"> ve <link rel="apple-touch-icon">
    // etiketlerini kendisi üretir. Burada bir de metadata.icons tanımlanırsa
    // ikisi birden çıkar ve çakışır. Eskiden 518 KB'lık /logo.png favicon
    // olarak veriliyordu; ayrıca src/app/favicon.ico (Next varsayılanı)
    // hâlâ duruyordu — o dosya silindi.
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${body.variable} ${display.variable}`}>
      <body>
        {/* JS kapalıysa intro perdesi ekranı kilitlemesin */}
        <noscript>
          <style>{`[data-intro-overlay]{display:none !important}`}</style>
        </noscript>
        <NextIntlClientProvider>
          <OrganizationSchema locale={locale as Locale} />
          <Header />
          <main id="content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
