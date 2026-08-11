/**
 * Hero intro sahneleri — dünyadan Çankırı Orta'daki fabrikaya kademeli zoom.
 *
 * `image` null olduğu sürece prosedürel bir placeholder çizilir, yani görseller
 * gelmeden de animasyon tam çalışır. Yusuf görselleri atınca yapılacak tek iş:
 * ilgili satıra `image: '/hero/xxx.jpg'` yazmak.
 *
 * Önerilen görsel özellikleri: 2000x1400 civarı, jpg/webp, ortalanmış hedef nokta.
 */
export type HeroLayerId = 'world' | 'turkey' | 'cankiri' | 'orta' | 'factory';

export type HeroLayer = {
  id: HeroLayerId;
  image: string | null;
  /** Bu sahne ekranda ne kadar kalsın (ms) */
  duration: number;
  /** Sahne etiketi — sağ altta yazan konum bilgisi (çeviri anahtarı) */
  labelKey: 'world' | 'turkey' | 'cankiri' | 'orta' | null;
};

export const heroLayers: HeroLayer[] = [
  {id: 'world', image: '/hero/01-world.jpg', duration: 1200, labelKey: 'world'},
  {id: 'turkey', image: '/hero/02-turkey.jpg', duration: 1100, labelKey: 'turkey'},
  {id: 'cankiri', image: '/hero/03-cankiri.jpg', duration: 1100, labelKey: 'cankiri'},
  {id: 'orta', image: '/hero/04-orta.jpg', duration: 1100, labelKey: 'orta'},
  {id: 'factory', image: '/factory/fabrika-dis.jpg', duration: 0, labelKey: null}
];

/** Her sahnede uygulanan yakınlaşma katsayısı */
export const ZOOM_FACTOR = 4;
