/**
 * Firma künyesi. Buradaki adres/telefon bilgisi Google Business Profile ve
 * diğer dizinlerdekiyle BİREBİR aynı olmalı (NAP tutarlılığı) — yerel SEO'nun
 * en çok göz ardı edilen kısmı burası.
 *
 * Doldurulan alanlar SEO-Metinleri.md ve görsel paketi README'sindeki
 * doğrulanmış bilgilerden alındı. TODO'lar hâlâ müşteri teyidi bekliyor.
 *
 * BOŞ BIRAKILAN ALANLAR ARAYÜZDE GÖSTERİLMEZ. Telefon, sosyal medya ve posta
 * kodu doğrulanana kadar boş kalmalı; footer, iletişim sayfası ve JSON-LD
 * bu alanları koşullu okuyacak şekilde yazıldı. Uydurma değer koymayın.
 */

/**
 * Asıl alan adı henüz kesinleşmedi (SEO metinlerinde .com.tr, kodda .com).
 * Karar verilene kadar deploy ortamından geçilebilsin diye env'e açıldı:
 * canonical, sitemap, robots ve Open Graph hepsi buradan besleniyor, yani
 * yanlış değer bütün SEO sinyallerini yanlış domaine gönderir.
 *
 * .env.local → NEXT_PUBLIC_SITE_URL=https://cankirigazozu.com.tr
 */
const url = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cankirigazozu.com').replace(
  /\/+$/,
  ''
);

const geo = {lat: 40.588559, lng: 33.182078};

export const site = {
  name: 'Çankırı Gazozu',
  legalName: 'Çankırı Gazozu', // TODO(Yusuf): resmî ticari unvan
  /** Markanın ilk kızılcık gazozunu ürettiği yıl */
  foundedYear: 2019,
  founder: 'Aybars Şentürk',
  /** Orta OSB'deki fabrikanın resmî açılışı */
  factoryOpenedAt: '2026-07-11',

  domain: new URL(url).host,
  url,

  address: {
    street: 'Orta Organize Sanayi Bölgesi', // TODO: parsel/kapı no
    locality: 'Hüyükköy',
    district: 'Orta',
    city: 'Çankırı',
    region: 'Çankırı',
    postalCode: '', // TODO
    country: 'TR'
  },
  // Fabrikanın yaklaşık merkezi (görsel paketi README'sinden doğrulandı).
  geo,
  /** Footer ve iletişim sayfasındaki "Haritada göster" bağlantısı */
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${geo.lat}%2C${geo.lng}`,

  phone: '', // TODO: +90 ...
  email: 'info@cankirigazozu.com', // TODO
  dealerEmail: 'info@cankirigazozu.com', // TODO: başvurular buraya düşecek

  logo: '/logo.png',
  shareImage: '/paylasim-gorseli.jpg',

  // TODO(Yusuf): iki kaynak çelişiyor — SEO metinlerinde @cankirigazozu_18,
  // görsel paketinde @cankirigazozu. Doğrusu teyit edilmeden yayına konmayacak;
  // yanlış hesap sameAs'ta Google'a hatalı sinyal verir.
  social: {
    instagram: '',
    facebook: '',
    youtube: ''
  },

  /**
   * Gizlilik ve KVKK metinlerinin son güncellenme tarihi (ISO).
   * Metinlerin içeriği değişirse bu tarih de güncellenmeli.
   * TODO(Yusuf): bu metinler bir hukukçu tarafından kontrol edilmeli.
   */
  legalUpdatedAt: '2026-08-12',

  /** Bayilik ağının aktif olduğu iller */
  activeRegions: [
    'Bartın',
    'Bolu',
    'Çankırı',
    'Çorum',
    'Düzce',
    'Karabük',
    'Kastamonu',
    'Sinop',
    'Zonguldak'
  ]
} as const;
