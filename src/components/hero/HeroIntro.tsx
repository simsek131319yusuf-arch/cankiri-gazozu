'use client';

import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {motion} from 'motion/react';
import {useTranslations} from 'next-intl';
import {heroLayers} from '@/data/hero';
import {usePrefersReducedMotion} from '@/hooks/usePrefersReducedMotion';
import LayerVisual from './LayerVisual';

const SESSION_KEY = 'cg:intro-skipped';
const MOBILE_QUERY = '(max-width: 768px)';
/** Metadata hiç gelmezse (ağ/codec sorunu) sayfayı kilitli bırakmamak için son çare */
const METADATA_TIMEOUT = 8000;
/** Video süresi bilindiğinde sonuna eklenen pay — `ended` gelmezse devreye girer */
const ENDED_GRACE = 3000;

const POSTER = '/factory/fabrika-dis.jpg';
const factoryLayer = heroLayers[heroLayers.length - 1];

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
 *
 * Masaüstü/mobil seçimi CSS ile gizleyerek değil, tek <video> render ederek
 * yapılır — aksi halde tarayıcı iki videoyu birden indirir.
 */
export default function HeroIntro({onFinish}: {onFinish: () => void}) {
  const t = useTranslations('hero');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [finished, setFinished] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  // Sunucuda hangi ekranda olduğumuz bilinemez; null dönüp ilk boyada hiç video
  // basmıyoruz. Yanlış varyantı basıp sonra değiştirmek çift indirme demek olurdu.
  const variant = useSyncExternalStore<Variant | null>(
    subscribeToViewport,
    readViewport,
    () => null
  );

  // Sunucuda her zaman false — istemcide gerçek değerle hidrate olur.
  const skippedBefore = useSyncExternalStore(
    subscribeToNothing,
    readSkippedFlag,
    () => false
  );

  const reduceMotion = usePrefersReducedMotion();

  const running = !finished && !skippedBefore && !reduceMotion;
  // Hareket hassasiyeti olan ziyaretçide perde fade bile yapmadan kalksın.
  const exitDuration = reduceMotion ? 0 : 0.8;

  /**
   * Intro her açılışta oynar (Yusuf'un kararı). Oturum bayrağı SADECE kullanıcı
   * bilerek geçtiğinde yazılır — video kendi sonuna geldiyse yazılmaz, yoksa
   * sayfa yenilendiğinde intro bir daha hiç görünmez.
   */
  const finish = useCallback((skippedByUser = false) => {
    setFinished(true);
    if (!skippedByUser) return;
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

  // Video takılırsa (ağ kesilmesi, codec sorunu, `ended` hiç gelmemesi) intro
  // sonsuza kadar durmasın. Süre bilindiğinde ona göre, bilinmiyorsa sabit pay.
  useEffect(() => {
    if (!running) return;
    const delay = duration ? duration * 1000 + ENDED_GRACE : METADATA_TIMEOUT;
    const timer = setTimeout(() => finish(), delay);
    return () => clearTimeout(timer);
  }, [running, duration, finish]);

  // Intro bitince sayfayı serbest bırak
  useEffect(() => {
    document.body.dataset.intro = running ? 'running' : 'done';
    if (!running) onFinish();
    return () => {
      delete document.body.dataset.intro;
    };
  }, [running, onFinish]);

  // Klavyeyle atlama
  useEffect(() => {
    if (!running) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        finish(true);
      }
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
      role="presentation"
    >
      {running && (
        <>
          {/* Video hazır olana kadar altta duran final fabrika karesi.
              Hero'daki görselle aynı kaynak olduğu için ek indirme yapmaz ve
              siyah ekran hiç görünmez. */}
          <div className="absolute inset-0">
            <LayerVisual layer={factoryLayer} priority />
          </div>

          {variant && (
            <motion.video
              key={variant}
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={POSTER}
              disablePictureInPicture
              controls={false}
              controlsList="nodownload noplaybackrate noremoteplayback"
              onContextMenu={(event) => event.preventDefault()}
              onLoadedMetadata={(event) => {
                const value = event.currentTarget.duration;
                setDuration(Number.isFinite(value) ? value : null);
              }}
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
            onClick={() => finish(true)}
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

function readSkippedFlag() {
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

