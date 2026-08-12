import Image from 'next/image';

/**
 * Fabrikanın dış cephe karesi — hero arka planı, intro perdesinin altındaki
 * son kare ve /hakkimizda görseli aynı dosyayı kullanır. Tek kaynaktan
 * okunması bilinçli: tarayıcı görseli bir kez indirir, intro bittiğinde
 * hero'da siyah ekran görünmez.
 *
 * ESKİ YAPI: burada `LayerVisual` + `heroLayers` vardı; dünyadan Çankırı'ya
 * kademeli zoom yapan 5 katmanlı intro'nun altyapısıydı. Video intro'ya
 * geçilince yalnızca son katman kullanılır oldu, geri kalanı (ve görsel
 * gelmeden çizen prosedürel SVG placeholder'ları) ölü koda dönüştü.
 * Client bileşeni olan HeroIntro bu altyapıyı gereksiz yere paketine
 * dahil ediyordu; bu dosya onun yerine geçti.
 *
 * NOT: public/hero/*.jpg görselleri (dünya/Türkiye/Çankırı/Orta uydu
 * katmanları) SİLİNMEDİ — ileride kullanılabilir diye duruyorlar.
 */
/**
 * Açılış günü çekilmiş yatay drone karesi. Intro videosunun son karesiyle aynı
 * sahne olduğu için perde kalkarken dikiş görünmesin diye intro'nun altında
 * bunu kullanıyoruz.
 */
export const FACTORY_IMAGE = '/factory/fabrika-dis.jpg';

/**
 * Gün batımında çekilmiş dikey kare (1105x1423). Fabrika kadrajın ortasında,
 * fotoğraf daha ferah; hero'da bu kullanılıyor.
 *
 * BİLEREK LOGOSUZ SÜRÜM: aynı fotoğrafın marka rozeti ve "Organize Sanayi
 * Bölgesi / Orta - Çankırı" yazısı gömülü bir afiş varyantı da var, ama o
 * sürüm arka plan olarak kullanılamaz:
 *   - site başlığındaki logoyla aynı anda görünüp çift logo yaratıyordu,
 *   - gömülü yazı dilden bağımsızdı (İngilizce ziyaretçi de Türkçe görürdü),
 *   - ekran okuyucuya ve arama motoruna ulaşmıyordu.
 * Afiş varyantı sosyal paylaşım görseli olarak çok daha uygun.
 *
 * Dosya adındaki "-sade" eki bilinçli: afiş varyantı da eklenirse ikisi yan
 * yana durabilsin. Ayrıca görsel bir kez aynı adla değiştirildiğinde hem
 * tarayıcı hem Next'in görsel önbelleği eski kareyi servis etmeye devam
 * ediyordu; içerik değişince DOSYA ADI da değişmeli.
 */
export const FACTORY_IMAGE_SUNSET = '/factory/fabrika-gun-batimi-sade.jpg';

export default function FactoryBackdrop({
  src = FACTORY_IMAGE,
  priority,
  className = 'object-cover'
}: {
  src?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      // Dekoratif arka plan: anlamı çevresindeki metin taşıyor, ekran
      // okuyucuya ikinci kez okutmuyoruz.
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      className={className}
    />
  );
}
