import {site} from '@/data/site';
import type {Locale} from '@/i18n/routing';

/**
 * LocalBusiness + Organization yapısal verisi.
 *
 * Yerel aramada ("çankırı gazoz fabrikası") Google'a "bu gerçek bir işletme,
 * şu adreste" diyen kısım burası. site.ts'teki TODO alanları doldurulmadan
 * tam etkisini göstermez.
 */
export default function OrganizationSchema({locale}: {locale: Locale}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'FoodEstablishment'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: locale === 'tr' ? site.url : `${site.url}/${locale}`,
    logo: `${site.url}${site.logo}`,
    image: `${site.url}${site.shareImage}`,
    foundingDate: String(site.foundedYear),
    founder: {'@type': 'Person', name: site.founder},
    description:
      locale === 'tr'
        ? "Çankırı'nın yerli gazoz markası. Kızılcık, klasik ve portakal aromalarıyla, cam şişede. Orta ilçesindeki kendi fabrikamızda üretiliyor."
        : "Çankırı's local soda brand. Cornelian cherry, classic and orange aromas in glass bottles, produced in our own factory in Orta.",
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street || undefined,
      addressLocality: `${site.address.locality}, ${site.address.district}`,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode || undefined,
      addressCountry: site.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng
    },
    areaServed: {'@type': 'AdministrativeArea', name: 'Çankırı'},
    telephone: site.phone || undefined,
    email: site.email,
    sameAs: Object.values(site.social).filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      // Yapısal veri script'i — içerik bizim kontrolümüzde, kullanıcı girdisi yok.
      dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
    />
  );
}
