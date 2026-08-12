'use client';

import {useEffect, useLayoutEffect, useState} from 'react';
import {motion} from 'motion/react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import type {Product} from '@/data/types';
import {pick} from '@/data/types';
import {usePrefersReducedMotion} from '@/hooks/usePrefersReducedMotion';
import BottleVisual from './BottleVisual';

/**
 * Kartın hangi yönden geleceği — soldaki soldan, sağdaki sağdan, ortadaki
 * aşağıdan. Mesafe mobilde bilerek küçük: 140 px'lik giriş küçük ekranda
 * fazla teatral duruyordu, masaüstündeki his korunuyor.
 */
const DISTANCE = {mobile: 44, desktop: 140} as const;

function entrance(position: Product['position'], distance: number) {
  if (position === 'left') return {x: -distance, y: 0};
  if (position === 'right') return {x: distance, y: 0};
  return {x: 0, y: distance};
}

/**
 * Sunucuda useLayoutEffect uyarı verir; istemcide ise boyamadan ÖNCE çalışır.
 * Giriş animasyonunu bu kancayla açtığımız için kart "önce görünüp sonra
 * kaybolma" titremesi yaşamaz.
 */
const useClientLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function ProductCard({
  product,
  locale,
  index
}: {
  product: Product;
  locale: Locale;
  index: number;
}) {
  const t = useTranslations('products');
  const [open, setOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  /**
   * PROGRESSIVE ENHANCEMENT — ürünler animasyona bağlı olmamalı.
   * Sunucu HTML'inde ve JavaScript çalışmadığında kart hiçbir opacity/transform
   * almadan basılır, yani her koşulda GÖRÜNÜRDÜR. Giriş animasyonu yalnızca
   * istemci hidrasyonu tamamlandıktan sonra ekleniyor.
   */
  const [from, setFrom] = useState<{x: number; y: number} | null>(null);

  useClientLayoutEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const distance = isDesktop ? DISTANCE.desktop : DISTANCE.mobile;
    setFrom(entrance(product.position, distance));
  }, [product.position]);

  // Hareket azaltma tercihinde giriş animasyonu HİÇ uygulanmaz — kart anında
  // ve kesin olarak görünür kalır.
  const animated = from !== null && !reduceMotion;

  const motionProps = animated
    ? {
        initial: {opacity: 0, ...from},
        whileInView: {opacity: 1, x: 0, y: 0},
        viewport: {once: true, amount: 0.35},
        transition: {
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1] as const,
          delay: index * 0.12
        }
      }
    : {};

  return (
    <motion.article
      {...motionProps}
      className="group relative flex flex-col items-center"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={`product-detail-${product.slug}`}
        className="flex w-full cursor-pointer flex-col items-center rounded-3xl px-4 pt-8 pb-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
        style={{['--tw-ring-color' as string]: product.theme.base}}
      >
        <div
          className="pointer-events-none absolute top-16 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90"
          style={{background: product.theme.glow, opacity: 0.45}}
        />

        <motion.div
          className="relative h-72 sm:h-80 lg:h-96"
          whileHover={
            reduceMotion
              ? undefined
              : {y: -14, rotate: product.position === 'center' ? 0 : 1}
          }
          transition={{type: 'spring', stiffness: 220, damping: 18}}
        >
          <BottleVisual product={product} locale={locale} />
        </motion.div>

        {/* Rozet alanı her kartta sabit yükseklikte duruyor: rozeti olmayan
            kartlarda başlık yukarı kaymasın, üç başlık aynı çizgide olsun.
            Boş alan ekran okuyucuya duyurulmaz. */}
        <div
          className="relative mt-6 flex h-7 items-center"
          aria-hidden={product.badge ? undefined : true}
        >
          {product.badge && (
            <span
              className="rounded-full px-4 py-1.5 text-xs font-bold tracking-wider text-paper uppercase"
              style={{background: product.theme.base}}
            >
              {pick(product.badge, locale)}
            </span>
          )}
        </div>

        {/* Başlık + alt satır sabit yükseklikli bir alanda duruyor. Ürün adları
            ve tagline'lar farklı uzunlukta (İngilizce'de "Cornelian Cherry Soda"
            iki satıra iniyor); sabit alan olmadan alttaki ipucu satırı her
            kartta farklı yükseklikte kalıyordu. */}
        <div className="relative mt-5 flex min-h-[6.5rem] w-full flex-col items-center sm:min-h-[7.5rem]">
          <h3
            className="font-display text-center text-2xl font-bold text-balance sm:text-3xl"
            style={{color: product.theme.base}}
          >
            {pick(product.name, locale)}
          </h3>
          <p className="mt-2 max-w-xs text-center text-[15px] leading-relaxed text-muted">
            {pick(product.tagline, locale)}
          </p>
        </div>

        <span className="relative text-xs font-semibold tracking-[0.2em] text-ink-2/60 uppercase">
          {open ? t('closeHint') : t('tapHint')}
        </span>
      </button>

      {/* Panel her zaman DOM'da: açılıp kapanan bir accordion. Koşullu render
          edilseydi ürün sayfası linkleri HTML'de hiç görünmez, arama motoru
          ana sayfadan ürün sayfalarına giden iç linkleri bulamazdı. */}
      <motion.div
        id={`product-detail-${product.slug}`}
        initial={false}
        animate={{height: open ? 'auto' : 0, opacity: open ? 1 : 0}}
        transition={{duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1]}}
        className="w-full overflow-hidden"
        inert={!open}
      >
        <div
          className="mt-2 flex flex-col rounded-2xl border-t-4 bg-paper-2/70 p-6 text-center"
          style={{borderColor: product.theme.base}}
        >
          {/* Açıklama metinleri birbirine yakın uzunlukta yazıldı, ama yine de
              sabit bir alanda duruyor: birden fazla kart açıldığında ambalaj
              satırı ve ürün sayfası bağlantısı üç kartta da aynı hizada kalsın. */}
          <p className="min-h-[5.5rem] text-[15px] leading-relaxed text-ink-2 sm:min-h-[6.5rem]">
            {pick(product.shortDescription, locale)}
          </p>
          {/* Hacim doğrulanana kadar sadece ambalaj bilgisi gösteriliyor */}
          <p className="mt-4 text-xs tracking-wider text-muted uppercase">
            {product.volumeMl
              ? t('volume', {volume: product.volumeMl})
              : pick(product.packaging, locale)}
          </p>
          <Link
            href={{pathname: '/urunler/[slug]', params: {slug: product.slug}}}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
            style={{color: product.theme.base}}
          >
            {t('detail', {name: pick(product.name, locale)})}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.div>
    </motion.article>
  );
}
