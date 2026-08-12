import type {Product} from './types';

/**
 * ŞU AN: içerik burada duruyor.
 * ADMİN PANELİ GELİNCE: sadece aşağıdaki iki fonksiyonun gövdesi DB sorgusuna döner.
 * Sayfalar bu fonksiyonlardan başka bir yerden ürün okumaz — bu kural bozulursa
 * admin paneli baştan yazım demek.
 *
 * Fonksiyonlar bilerek async: DB'ye geçtiğimizde imza değişmesin.
 *
 * Türkçe metinler SEO-Metinleri.md ve görsel paketindeki README'den birebir alındı.
 * DİKKAT: sade-gazoz.png dosya adı korunuyor ama ürün her yerde "Klasik Gazoz".
 */
const products: Product[] = [
  {
    slug: 'portakal-gazozu',
    order: 1,
    position: 'left',
    name: {tr: 'Portakal Gazozu', en: 'Orange Soda'},
    tagline: {
      tr: 'Cam şişe · Yerli üretim',
      en: 'Glass bottle · Made in Türkiye'
    },
    shortDescription: {
      tr: "Türkiye'nin en çok tüketilen gazoz aroması; cam şişede ve yerli üretimle. Soğuk içildiğinde ferahlatıcı.",
      en: "Türkiye's most widely consumed soda aroma, in a glass bottle and locally produced. Refreshing when served cold."
    },
    longDescription: {
      tr: "Portakal, Türkiye'de en çok tercih edilen gazoz aroması. Çankırı Gazozu Portakal bu tanıdık aromayı, kendi fabrikamızda ve cam şişede üretilmiş bir alternatif olarak sunuyor. Aroma seviyesi bilinçli olarak dengede tutuldu; amaç öne çıkan bir tat değil, günlük tüketime uygun bir gazoz. Karbonasyonu klasik ürünümüzle aynı seviyede.",
      en: 'Orange is the most widely preferred soda aroma in Türkiye. Çankırı Gazozu Orange offers that familiar aroma as an alternative produced in our own factory and bottled in glass. The aroma level was deliberately kept in balance: the aim is not a standout flavour but a soda suited to everyday drinking. Its carbonation matches our classic bottle.'
    },
    taste: {
      tr: 'Aroma seviyesi dengede tutuldu; yapay bir keskinlik de silik bir tat da yok. Karbonasyonu klasik ürünümüzle aynı. Soğuk içildiğinde ferahlığı belirginleşir.',
      en: 'The aroma is kept in balance — neither artificially sharp nor washed out. Carbonation matches our classic bottle, and the refreshing character comes through when served cold.'
    },
    pairing: {
      tr: 'Tuzlu atıştırmalıklar ve çerezle iyi gider. Kahvaltıdan çok gün içi ve akşam tüketimine uygun.',
      en: 'Goes well with salty snacks and nuts. Better suited to daytime and evening drinking than to breakfast.'
    },
    flavor: {tr: 'Portakal', en: 'Orange'},
    badge: null,
    metaTitle: {
      tr: 'Portakal Gazozu | Yerli Üretim, Cam Şişe — Çankırı Gazozu',
      en: 'Orange Soda | Local Production, Glass Bottle — Çankırı Gazozu'
    },
    metaDescription: {
      tr: "Cam şişede portakal gazozu. Çankırı'daki kendi fabrikamızda üretiliyor; aroması dengeli, soğuk içildiğinde ferahlatıcı.",
      en: 'Orange soda in a glass bottle, produced in our own factory in Çankırı. Balanced aroma, refreshing when served cold.'
    },
    volumeMl: null, // TODO(Yusuf): ambalajdan teyit alınacak — [DOĞRULA]
    packaging: {tr: 'Cam şişe', en: 'Glass bottle'},
    image: '/products/portakalli-gazoz.png',
    imageAlt: {
      tr: 'Cam şişede Çankırı Gazozu portakal aromalı gazoz',
      en: 'Çankırı Gazozu orange flavoured soda in a glass bottle'
    },
    imageTitle: {
      tr: 'Çankırı Gazozu Portakal — Cam Şişe',
      en: 'Çankırı Gazozu Orange — Glass Bottle'
    },
    theme: {base: '#F07E13', accent: '#FFB347', glow: 'rgba(240,126,19,0.45)'},
    available: true
  },
  {
    slug: 'klasik-gazoz',
    order: 2,
    position: 'center',
    name: {tr: 'Klasik Gazoz', en: 'Classic Soda'},
    tagline: {
      tr: 'Cam şişe · Sade ve dengeli',
      en: 'Glass bottle · Plain and balanced'
    },
    shortDescription: {
      tr: 'Belirgin bir meyve aroması olmayan sade gazoz. Dengeli tatlılık, yüksek karbonasyon ve temiz bir bitiş.',
      en: 'A plain soda with no dominant fruit aroma. Balanced sweetness, high carbonation and a clean finish.'
    },
    longDescription: {
      tr: 'Çankırı Gazozu Klasik, geleneksel sade gazoz tarifini esas alır. Belirgin bir meyve aroması içermez; dengeli tatlılık, yüksek karbonasyon ve temiz bir bitiş üzerine kuruludur. Yemeğin tadının önüne geçmediği için sofrada, mangalda ve toplu tüketimde tercih edilir. Cam şişenin tada katkısı en çok bu üründe fark edilir, çünkü aroma sade olduğu ölçüde ambalajın etkisi belirginleşir.',
      en: 'Çankırı Gazozu Classic is based on the traditional plain soda recipe. It carries no dominant fruit aroma; it is built on balanced sweetness, high carbonation and a clean finish. Because it never competes with the food, it is the bottle chosen at the table, at a barbecue and for larger gatherings. The contribution of the glass bottle is most noticeable here: the plainer the aroma, the clearer the effect of the packaging.'
    },
    taste: {
      tr: 'Belirgin bir meyve aroması yok. Dengeli tatlılık, yüksek karbonasyon ve temiz bir bitiş. Cam şişenin katkısı en çok bu üründe fark edilir.',
      en: 'No dominant fruit aroma. Balanced sweetness, high carbonation and a clean finish. The contribution of the glass bottle is most noticeable here.'
    },
    pairing: {
      tr: 'Yemeğin tadının önüne geçmez; sofrada, mangalda ve toplu tüketimde tercih edilir.',
      en: 'It never competes with the food; a common choice at the table, at a barbecue and for larger gatherings.'
    },
    flavor: {tr: 'Klasik', en: 'Classic'},
    badge: null,
    metaTitle: {
      tr: 'Klasik Gazoz | Cam Şişede Nostaljik Tat — Çankırı Gazozu',
      en: 'Classic Soda | Nostalgic Taste in Glass — Çankırı Gazozu'
    },
    metaDescription: {
      tr: 'Hafızanızdaki gazoz. Sade, dengeli, cam şişede. Çankırı Gazozu Klasik, eski usul gazozun tadını bugüne taşıyor.',
      en: 'The soda you remember. Plain, balanced, in a glass bottle. Çankırı Gazozu Classic brings old-style soda into today.'
    },
    volumeMl: null, // TODO(Yusuf): ambalajdan teyit alınacak — [DOĞRULA]
    packaging: {tr: 'Cam şişe', en: 'Glass bottle'},
    // Dosya adı sade-gazoz.png; ürün adı her yerde "Klasik Gazoz".
    image: '/products/sade-gazoz.png',
    imageAlt: {
      tr: 'Cam şişede Çankırı Gazozu klasik sade gazoz',
      en: 'Çankırı Gazozu classic plain soda in a glass bottle'
    },
    imageTitle: {
      tr: 'Çankırı Gazozu Klasik — Cam Şişe',
      en: 'Çankırı Gazozu Classic — Glass Bottle'
    },
    theme: {base: '#1E7A55', accent: '#7FD6AE', glow: 'rgba(30,122,85,0.45)'},
    available: true
  },
  {
    slug: 'kizilcik-gazozu',
    order: 3,
    position: 'right',
    name: {tr: 'Kızılcık Gazozu', en: 'Cornelian Cherry Soda'},
    tagline: {
      tr: "Türkiye'de bir ilk · Cam şişe",
      en: 'A first in Türkiye · Glass bottle'
    },
    shortDescription: {
      tr: "Çankırı'nın kızılcığından üretilen, ekşi karakterli gazoz. Etli ve yağlı yemeklerle iyi eşleşir.",
      en: "A tart soda made from Çankırı's cornelian cherry. It pairs well with rich and meaty dishes."
    },
    longDescription: {
      tr: "Kızılcık, gazozda dengelenmesi zor bir meyve: ekşiliği baskındır, fazla tatlandırıldığında karakterini kaybeder, az tatlandırıldığında içilmez. Çankırı Gazozu Kızılcık bu dengeyi kurmak için geliştirildi ve 2019'da üretildiğinde Türkiye'de benzeri bulunmuyordu. Ekşiliği yağı kestiği için etli yemeklerle birlikte tüketilmeye uygundur. En iyi sonucu buz gibi soğuk içildiğinde verir.",
      en: "Cornelian cherry is a difficult fruit to balance in a soda: its tartness dominates, too much sugar strips its character and too little makes it undrinkable. Çankırı Gazozu Cornelian Cherry was developed to strike that balance, and when it was produced in 2019 there was nothing like it in Türkiye. Because the tartness cuts through fat, it suits rich, meaty food. It works best served ice cold."
    },
    taste: {
      tr: 'Ekşilik ilk yudumda hissedilir, kızılcığın meyve tadı arkadan gelir. Bitişte ağızda tatlı bir iz bırakmaz. Ilık içildiğinde ekşilik öne çıktığı için buz gibi soğuk önerilir.',
      en: 'The tartness registers on the first sip and the fruit follows behind it. It leaves no sweet trace at the finish. Served warm the tartness dominates, so we recommend it ice cold.'
    },
    pairing: {
      tr: 'Ekşiliği yağı kestiği için kebap, pide ve mangalla iyi eşleşir. Şerbetli tatlılardan sonra da tercih edilebilir.',
      en: 'The tartness cuts through fat, so it pairs well with kebab, pide and barbecue. It can also follow syrupy desserts.'
    },
    flavor: {tr: 'Kızılcık', en: 'Cornelian Cherry'},
    // "Türkiye'de ilk ve TEK" mutlak bir üstünlük iddiasıydı ve marka tarafından
    // yazılı teyit edilmemişti; reklam mevzuatı açısından ispat yükü doğurur.
    // Bugünü değil geçmişi anlatan "bir ilk" ifadesine çevrildi — bu, 2019'da
    // üretildiğinde benzerinin bulunmaması olgusuyla destekleniyor.
    // TODO(Yusuf): marka yazılı belge sunarsa "ilk ve tek"e geri dönülebilir.
    badge: {tr: "Türkiye'de bir ilk", en: 'A first in Türkiye'},
    metaTitle: {
      tr: "Kızılcık Gazozu | Cam Şişede Çankırı'nın Kızılcığı — Çankırı Gazozu",
      en: "Cornelian Cherry Soda | Çankırı's Cornelian Cherry in Glass — Çankırı Gazozu"
    },
    metaDescription: {
      tr: "Çankırı'nın kızılcığından, cam şişede. Türkiye'de bir ilk olan kızılcık aromalı gazoz. Ekşi, canlı, başka hiçbir gazoza benzemeyen bir tat.",
      en: "From Çankırı's cornelian cherry, in a glass bottle. A first in Türkiye — tart, lively and unlike any other soda."
    },
    volumeMl: null, // TODO(Yusuf): ambalajdan teyit alınacak — [DOĞRULA]
    packaging: {tr: 'Cam şişe', en: 'Glass bottle'},
    image: '/products/kizilcikli-gazoz.png',
    imageAlt: {
      tr: 'Cam şişede Çankırı Gazozu kızılcık aromalı gazoz',
      en: 'Çankırı Gazozu cornelian cherry flavoured soda in a glass bottle'
    },
    imageTitle: {
      tr: 'Çankırı Gazozu Kızılcık — Cam Şişe',
      en: 'Çankırı Gazozu Cornelian Cherry — Glass Bottle'
    },
    theme: {base: '#B31F2E', accent: '#FF6B7A', glow: 'rgba(179,31,46,0.45)'},
    available: true
  }
];

export async function getProducts(): Promise<Product[]> {
  return [...products].sort((a, b) => a.order - b.order);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((product) => product.slug === slug) ?? null;
}
