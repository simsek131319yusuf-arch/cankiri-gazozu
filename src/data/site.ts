/**
 * Firma künyesi. Buradaki adres/telefon bilgisi Google Business Profile ve
 * diğer dizinlerdekiyle BİREBİR aynı olmalı (NAP tutarlılığı) — yerel SEO'nun
 * en çok göz ardı edilen kısmı burası.
 *
 * Doldurulan alanlar SEO-Metinleri.md ve görsel paketi README'sindeki
 * doğrulanmış bilgilerden alındı. TODO'lar hâlâ müşteri teyidi bekliyor.
 */
export const site = {
  name: 'Çankırı Gazozu',
  legalName: 'Çankırı Gazozu', // TODO(Yusuf): resmî ticari unvan
  /** Markanın ilk kızılcık gazozunu ürettiği yıl */
  foundedYear: 2019,
  founder: 'Aybars Şentürk',
  /** Orta OSB'deki fabrikanın resmî açılışı */
  factoryOpenedAt: '2026-07-11',

  // TODO(Yusuf): SEO metinlerinde cankirigazozu.com.tr geçiyor, sende .com var.
  // Canlıya çıkmadan hangisinin asıl alan adı olduğu netleşmeli.
  domain: 'cankirigazozu.com',
  url: 'https://cankirigazozu.com',

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
  geo: {lat: 40.588559, lng: 33.182078},

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
