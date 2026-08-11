import type {Locale} from '@/i18n/routing';

/**
 * İki dilli metin alanı. Admin panelinde her alan için tr/en girişi olacak.
 */
export type Localized = Record<Locale, string>;

export function pick(value: Localized, locale: Locale): string {
  return value[locale] || value.tr;
}

/**
 * Ürün şeması — veritabanına geçtiğimizde tablo kolonları birebir bunlar olacak.
 * Bugün alan eklemek bedava, sonradan eklemek migration demek.
 */
export type Product = {
  /** URL'de görünen kimlik: /urunler/kizilcikli-gazoz */
  slug: string;
  /** Vitrindeki sıra (küçükten büyüğe) */
  order: number;
  /** Hero/ürün bandındaki yerleşim — animasyon yönünü belirler */
  position: 'left' | 'center' | 'right';

  /** Kullanıcıya görünen ürün adı ve H1 */
  name: Localized;
  /** H1'in altındaki kısa nitelik satırı: "Cam şişe · Sade ve dengeli" */
  tagline: Localized;
  /** Ürün kartındaki kısa metin */
  shortDescription: Localized;
  /** Ürün sayfasındaki SEO ürün metni */
  longDescription: Localized;
  /** "Kızılcık", "Portakal", "Klasik" gibi aroma etiketi */
  flavor: Localized;
  /** Rozet: "Türkiye'de ilk ve tek" gibi. Yoksa null. */
  badge: Localized | null;

  /** Arama sonucundaki başlık */
  metaTitle: Localized;
  /** Arama sonucundaki açıklama */
  metaDescription: Localized;

  /**
   * Şişe hacmi (ml). null = henüz doğrulanmadı, arayüzde gösterilmez.
   * TODO(Yusuf): ambalajdan birebir teyit alınınca doldurulacak.
   */
  volumeMl: number | null;
  /** Ambalaj tipi — hacimden bağımsız, doğrulanmış bilgi */
  packaging: Localized;

  /** Ürün görseli — /public altındaki yol. null ise çizim placeholder gösterilir. */
  image: string | null;
  /** Görsel alt metni (SEO + erişilebilirlik) */
  imageAlt: Localized;
  /** Görselin title değeri */
  imageTitle: Localized;

  /** Kartın/sayfanın renk kimliği */
  theme: {
    base: string;
    accent: string;
    glow: string;
  };

  /** Satışta mı — false ise vitrinde "yakında" olarak görünür */
  available: boolean;
};

/**
 * Bayilik başvurusu — form alanları ve ileride DB tablosu.
 */
export type DealerApplication = {
  fullName: string;
  company: string;
  city: string;
  businessLine: string;
  phone: string;
  email?: string;
  message?: string;
};
