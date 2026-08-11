'use client';

import {useState} from 'react';
import {motion} from 'motion/react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import type {Product} from '@/data/types';
import {pick} from '@/data/types';
import BottleVisual from './BottleVisual';

/** Kartın hangi yönden geleceği — soldaki soldan, sağdaki sağdan, ortadaki aşağıdan. */
const entrance = {
  left: {x: -140, y: 0},
  right: {x: 140, y: 0},
  center: {x: 0, y: 140}
} as const;

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
  const from = entrance[product.position];

  return (
    <motion.article
      initial={{opacity: 0, ...from}}
      whileInView={{opacity: 1, x: 0, y: 0}}
      viewport={{once: true, amount: 0.35}}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.12
      }}
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
          whileHover={{y: -14, rotate: product.position === 'center' ? 0 : 1}}
          transition={{type: 'spring', stiffness: 220, damping: 18}}
        >
          <BottleVisual product={product} locale={locale} />
        </motion.div>

        {product.badge && (
          <span
            className="relative mt-6 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider text-paper uppercase"
            style={{background: product.theme.base}}
          >
            {pick(product.badge, locale)}
          </span>
        )}

        <h3
          className="font-display relative mt-5 text-2xl font-bold sm:text-3xl"
          style={{color: product.theme.base}}
        >
          {pick(product.name, locale)}
        </h3>
        <p className="relative mt-2 max-w-xs text-center text-[15px] leading-relaxed text-muted">
          {pick(product.tagline, locale)}
        </p>
        <span className="relative mt-4 text-xs font-semibold tracking-[0.2em] text-ink-2/60 uppercase">
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
        transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
        className="w-full overflow-hidden"
        inert={!open}
      >
            <div
          className="mt-2 rounded-2xl border-t-4 bg-paper-2/70 p-6 text-center"
          style={{borderColor: product.theme.base}}
        >
          <p className="text-[15px] leading-relaxed text-ink-2">
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
            {t('detail')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.div>
    </motion.article>
  );
}
