'use client';

import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {motion} from 'motion/react';
import {useTranslations} from 'next-intl';
import {usePrefersReducedMotion} from '@/hooks/usePrefersReducedMotion';
import FactoryBackdrop, {FACTORY_IMAGE} from './FactoryBackdrop';

const SESSION_KEY = 'cg:intro-seen';
const MOBILE_QUERY = '(max-width: 768px)';
/**
 * Metadata HİÇ gelmezse (ağ/codec sorunu) sayfayı kilitli bırakmamak için son
 * çare. Yalnızca bu durumda çalışır; metadata geldikten sonra iptal edilir.
 * 8 sn'lik eski değer 8,6 sn'lik videoyla sınırdaydı, yavaş bağlantıda video
 * daha başlamadan intro kapanıyordu.
 */
const METADATA_TIMEOUT = 12000;
/** Oynatma başladıktan sonra bu kadar süre ilerleme olmazsa (buffer/donma) kesilir */
const STALL_TIMEOUT = 4000;
/** Donma kontrolünün sıklığı */
const STALL_CHECK_INTERVAL = 1000;

/** Video posteri ile alttaki fabrika karesi AYNI dosya — tarayıcı bir kez indirir. */
const POSTER = FACTORY_IMAGE;

const sources = {
  desktop: {webm: '/video/intro-desktop.webm', mp4: '/video/intro-desktop.mp4'},
  mobile: {webm: '/video/intro-mobile.webm', mp4: '/video/intro-mobile.mp4'}
} as const;

type Variant = keyof typeof sources;

/**
 * Dünyadan Çankırı Orta'daki fabrikaya inen video intro.
 *
 * Kurallar (SEO/UX):
 * - Hero metni ve H1 bu overlay'in ALTINDA, DOM'da ilk saniyeden var.
 * - Skip butonu ilk kareden itibaren görünür.
 * - prefers-reduced-motion açıksa video hiç oynamaz, fabrika karesi kalır.
 * - Video oynatılamazsa/hata verirse intro kapanır, sayfa asla kilitli kalmaz.
 * - JS kapalıysa <noscript> overlay'i gizler (layout.tsx).
 * - Intro oturumda yalnızca bir kez oynar (bkz. finish()).
 *
 * Masaüstü/mobil seçimi CSS ile gizleyerek değil, tek <video> render ederek
 * yapılır — aksi halde tarayıcı iki videoyu birden indirir.
 */
export default function HeroIntro({onFinish}: {onFinish: () => void}) {
  const t = useTranslations('hero');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [finished, setFinished] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [metadataSeen, setMetadataSeen] = useState(false);
  /** Son ilerleme anı: {video saati, o anın zaman damgası} */
  const progressRef = useRef({time: 0, at: 0});

  // Sunucuda hangi ekranda olduğumuz bilinemez; null dönüp ilk boyada hiç video
  // basmıyoruz. Yanlış varyantı basıp sonra değiştirmek çift indirme demek olurdu.
  const variant = useSyncExternalStore<Variant | null>(
    subscribeToViewport,
    readViewport,
    () => null
  );

  // Sunucuda her zaman false — istemcide gerçek değerle hidrate olur.
  const introSeen = useSyncExternalStore(subscribeToNothing, readSeenFlag, () => false);

  const reduceMotion = usePrefersReducedMotion();

  const running = !finished && !introSeen && !reduceMotion;
  // Hareket hassasiyeti olan ziyaretçide perde fade bile yapmadan kalksın.
  const exitDuration = reduceMotion ? 0 : 0.8;

  /**
   * KARAR (12 Ağustos 2026): intro oturumda YALNIZCA BİR KEZ oynar.
   * ~11 MB'lık video her sayfa yenilemesinde tekrar tekrar izletilemez.
   * Bu yüzden bayrak intro nasıl biterse bitsin yazılır: video doğal olarak
   * bittiğinde de, kullanıcı "Geç"e bastığında da, hata/autoplay engeli ya da
   * emniyet kesmesi yüzünden kapandığında da. Eski davranış (her açılışta
   * oynatma) bilerek terk edildi; geri almayın.
   */
  const finish = useCallback(() => {
    setFinished(true);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage kapalıysa sadece bu sekmede tekrar oynar — kritik değil
    }
  }, []);

  // Mobil Safari yalnızca sessiz videoyu kendiliğinden oynatır. React `muted`
  // prop'unu ilk render'da DOM'a yazmayabildiği için elle garantiye alıyoruz.
  useEffect(() => {
    const video = videoRef.current;
    if (!running || !video) return;

    video.muted = true;
    video.defaultMuted = true;
    // iOS Safari bazı sürümlerde property'ye değil, HTML attribute'una bakıyor.
    // React `muted` prop'unu attribute olarak yazmadığı için elle ekliyoruz.
    video.setAttribute('muted', '');

    const promise = video.play();
    if (promise) {
      // Autoplay engellenirse kullanıcıyı bekletmeden içeriğe geçiyoruz.
      promise.catch(() => finish());
    }
  }, [running, variant, finish]);

  // 1) Metadata hiç gelmiyorsa (bozuk dosya, engellenen istek) sayfa kilitli
  // kalmasın. Metadata geldiği anda bu zamanlayıcı iptal olur; oynatma
  // süresince ASLA devrede değildir.
  useEffect(() => {
    if (!running || metadataSeen) return;
    const timer = setTimeout(() => finish(), METADATA_TIMEOUT);
    return () => clearTimeout(timer);
  }, [running, metadataSeen, finish]);

  // 2) Oynatma başladıktan sonraki emniyet: SÜREYE DEĞİL İLERLEMEYE bakılır.
  // Eski kod "video süresi + 3 sn" sonra kesiyordu; yavaş bağlantıda video
  // buffer'da beklerken bu süre doluyor ve intro video bitmeden kapanıyordu.
  // Artık yalnızca currentTime STALL_TIMEOUT boyunca hiç ilerlemezse kesiliyor,
  // yani buffer'da bekleyen ama ilerleyen video sonuna kadar oynayabiliyor.
  useEffect(() => {
    if (!running || !videoVisible) return;
    const video = videoRef.current;
    if (!video) return;

    progressRef.current = {time: video.currentTime, at: Date.now()};

    const onTimeUpdate = () => {
      const current = video.currentTime;
      // Küçük eşik: aynı kareyi tekrar bildiren timeupdate'ler ilerleme sayılmaz.
      if (current > progressRef.current.time + 0.05) {
        progressRef.current = {time: current, at: Date.now()};
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    const checker = setInterval(() => {
      if (Date.now() - progressRef.current.at > STALL_TIMEOUT) finish();
    }, STALL_CHECK_INTERVAL);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      clearInterval(checker);
    };
  }, [running, videoVisible, variant, finish]);

  // Intro bitince sayfayı serbest bırak
  useEffect(() => {
    document.body.dataset.intro = running ? 'running' : 'done';
    if (!running) onFinish();
    return () => {
      delete document.body.dataset.intro;
    };
  }, [running, onFinish]);

  // Klavyeyle atlama: YALNIZCA Escape. Enter/Space pencere seviyesinde
  // dinlenirse klavye ve ekran okuyucu kullanıcısı odaklandığı öğeyi
  // kullanmaya çalışırken introyu farkında olmadan kapatır. Görünür "Geç"
  // düğmesi zaten Enter/Space ile çalışıyor.
  useEffect(() => {
    if (!running) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') finish();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, finish]);

  return (
    <motion.div
      data-intro-overlay
      // Perde koşullu render edilmiyor: exit animasyonu herhangi bir sebeple
      // tamamlanmazsa üstte kalıp tıklamaları yutardı. Bunun yerine hep DOM'da
      // duruyor ama bittiği anda pointer-events ve inert ile devre dışı kalıyor.
      className={`fixed inset-0 z-50 overflow-hidden bg-night ${
        running ? '' : 'pointer-events-none'
      }`}
      initial={false}
      animate={{opacity: running ? 1 : 0}}
      transition={{duration: exitDuration, ease: 'easeInOut'}}
      inert={!running}
      // role="presentation" KALDIRILDI: perdenin içinde gerçek bir düğme var,
      // "sunum amaçlı" demek yanlış bir sinyaldi. Perde zaten anlamsal bir öğe
      // değil; rol vermemek doğrusu. Erişilebilir adı düğme taşıyor.
    >
      {running && (
        <>
          {/* Video hazır olana kadar altta duran fabrika karesi. BİLEREK hero'dan
              FARKLI görsel kullanıyor: buradaki amaç intro VİDEOSUNUN son
              karesiyle örtüşmek, hero'yla değil. Video yüklenirken siyah ekran
              yerine videonun bittiği sahne duruyor.
              Perde kalktığında hero'daki gün batımı karesi ortaya çıkıyor;
              bu bir geçiş, kusur değil. Video yeniden kodlanırken (DEVIR-NOTU
              §2.5) son karesi hero görseliyle uyumlu hale getirilirse geçiş
              tamamen görünmez olur. */}
          <div className="absolute inset-0 origin-bottom scale-[1.55] sm:scale-[1.35]">
            <FactoryBackdrop priority className="object-cover object-[50%_85%]" />
          </div>

          {variant && (
            <motion.video
              key={variant}
              ref={videoRef}
              autoPlay
              muted
              playsInline
              // preload="auto" ilk açılışta ~11 MB'lık indirmeyi peşinen
              // başlatıyordu. autoPlay zaten oynatma için gereken veriyi
              // çektiğinden "metadata" oynatmayı geciktirmiyor: tarayıcı
              // oynatmaya karar verdiği anda tamponlamayı kendisi sürdürüyor.
              // Kazanç, autoplay engellenen / hareket azaltma açık olan ya da
              // introyu ilk saniyede geçen ziyaretçide indirmenin hiç
              // büyümemesi. Poster ve altındaki fabrika karesi zaten hazır.
              preload="metadata"
              poster={POSTER}
              disablePictureInPicture
              controls={false}
              controlsList="nodownload noplaybackrate noremoteplayback"
              onLoadedMetadata={() => setMetadataSeen(true)}
              onCanPlay={() => setVideoVisible(true)}
              onEnded={() => finish()}
              onError={() => finish()}
              initial={{opacity: 0}}
              animate={{opacity: videoVisible ? 1 : 0}}
              transition={{duration: 0.4, ease: 'easeOut'}}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={sources[variant].webm} type="video/webm" />
              <source src={sources[variant].mp4} type="video/mp4" />
            </motion.video>
          )}

          {/* Skip butonu videonun her karesinde okunur kalmalı: koyu gökyüzünde
              de, açık bulut/arazi karesinde de. Kontrast bilerek yüksek. */}
          <button
            type="button"
            onClick={() => finish()}
            className="absolute right-6 bottom-8 rounded-full border border-paper/50 bg-black/55 px-6 py-2.5 text-sm font-medium tracking-wide text-paper shadow-lg backdrop-blur transition hover:border-paper hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-10"
          >
            {t('skip')}
          </button>
        </>
      )}
    </motion.div>
  );
}

/** sessionStorage değişmiyor; sadece ilk okuma için abonelik gerekiyor. */
function subscribeToNothing() {
  return () => {};
}

function readSeenFlag() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    // özel sekmede sessionStorage kapalı olabilir — intro yine de oynasın
    return false;
  }
}

function subscribeToViewport(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function readViewport(): Variant {
  return window.matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop';
}

