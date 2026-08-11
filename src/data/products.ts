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
      tr: 'Dolgun ve yuvarlak portakal aromasıyla serin, tanıdık ve ferahlatıcı bir yerli gazoz seçeneği.',
      en: 'A refreshing local soda with a full, round orange aroma — cool and familiar.'
    },
    longDescription: {
      tr: 'Çankırı Gazozu Portakal, en sevilen gazoz aromalarından birini yerli üretim ve cam şişe tercihiyle sunar. Dolgun, yuvarlak ve dengeli portakal aroması; soğuk tüketildiğinde ferahlığını belirgin biçimde gösterir. Tuzlu atıştırmalıklar, çerez ve keyifli akşam sofralarıyla iyi eşleşir.',
      en: 'Çankırı Gazozu Orange brings one of the best-loved soda aromas together with local production and a glass bottle. A full, round and balanced orange aroma that shows its freshness best when served cold. Pairs well with salty snacks, nuts and evening gatherings.'
    },
    flavor: {tr: 'Portakal', en: 'Orange'},
    badge: null,
    metaTitle: {
      tr: 'Portakal Gazozu | Yerli Üretim, Cam Şişe — Çankırı Gazozu',
      en: 'Orange Soda | Local Production, Glass Bottle — Çankırı Gazozu'
    },
    metaDescription: {
      tr: "Dolgun portakal aroması, cam şişede. Çankırı'daki kendi fabrikamızda üretilen yerli portakal gazozu.",
      en: 'A full orange aroma in a glass bottle. Local orange soda produced in our own factory in Çankırı.'
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
      tr: 'Sade, dengeli ve tanıdık. Eski usul gazozun ferahlığını cam şişede bugüne taşıyan klasik lezzet.',
      en: 'Plain, balanced and familiar. The freshness of old-style soda carried into today in a glass bottle.'
    },
    longDescription: {
      tr: 'Çankırı Gazozu Klasik, baskın bir meyve aromasına ihtiyaç duymayan, hafızalardaki geleneksel gazoz tadını temel alır. Dengeli tatlılık, canlı karbonasyon ve temiz bitiş sunar. Sofrada, mangalda veya yolda; yemeğin önüne geçmeden ferahlatan sade bir cam şişe gazoz seçeneğidir.',
      en: 'Çankırı Gazozu Classic is built on the traditional soda taste people remember, without needing a dominant fruit aroma. Balanced sweetness, lively carbonation and a clean finish. At the table, at a barbecue or on the road — a plain glass-bottle soda that refreshes without overpowering the food.'
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
      tr: "Türkiye'de ilk ve tek · Cam şişe",
      en: 'First and only in Türkiye · Glass bottle'
    },
    shortDescription: {
      tr: "Çankırı'nın kızılcığından ilham alan, ekşi ve canlı karakteriyle diğer gazozlardan ayrılan özgün bir tat.",
      en: "Inspired by Çankırı's cornelian cherry — a distinctive taste that stands apart with its tart, lively character."
    },
    longDescription: {
      tr: "Kızılcık, belirgin ekşiliği ve meyvemsi derinliği nedeniyle dengelenmesi ustalık isteyen bir aroma. Çankırı Gazozu Kızılcık, ilk yudumda canlı bir ekşilik, ardından temiz ve ferah bir bitiş sunar. Özellikle kebap, pide, mangal ve Çankırı'nın etli yemekleriyle iyi eşleşir. En iyi deneyim için buz gibi soğuk tüketilmesi önerilir.",
      en: 'Cornelian cherry is an aroma that takes skill to balance, with its pronounced tartness and fruity depth. Çankırı Gazozu Cornelian Cherry opens with a lively tartness and closes clean and refreshing. It pairs especially well with kebab, pide, barbecue and the meat dishes of Çankırı. Best served ice cold.'
    },
    flavor: {tr: 'Kızılcık', en: 'Cornelian Cherry'},
    // NOT: "Türkiye'de ilk ve tek" iddiası marka tarafından yazılı teyit edilmeden
    // kesin reklam iddiası olarak yayına çıkmamalı (README yayın notu).
    badge: {tr: "Türkiye'de ilk ve tek", en: 'First and only in Türkiye'},
    metaTitle: {
      tr: "Kızılcık Gazozu | Türkiye'de İlk ve Tek — Çankırı Gazozu",
      en: 'Cornelian Cherry Soda | First and Only in Türkiye — Çankırı Gazozu'
    },
    metaDescription: {
      tr: "Çankırı'nın kızılcığından, cam şişede. Türkiye'nin ilk ve tek kızılcık aromalı gazozu. Ekşi, canlı, başka hiçbir gazoza benzemeyen bir tat.",
      en: "From Çankırı's cornelian cherry, in a glass bottle. Türkiye's first and only cornelian cherry soda. Tart, lively, unlike any other soda."
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
