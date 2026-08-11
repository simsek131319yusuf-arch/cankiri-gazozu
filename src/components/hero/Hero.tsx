'use client';

import {useCallback, useState} from 'react';
import {motion} from 'motion/react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {heroLayers} from '@/data/hero';
import {usePrefersReducedMotion} from '@/hooks/usePrefersReducedMotion';
import LayerVisual from './LayerVisual';
import HeroIntro from './HeroIntro';

const factoryLayer = heroLayers[heroLayers.length - 1];

export default function Hero() {
  const t = useTranslations('hero');
  const [introDone, setIntroDone] = useState(false);
  const handleFinish = useCallback(() => setIntroDone(true), []);
  const reduceMotion = usePrefersReducedMotion();

  // Hareket hassasiyeti olan ziyaretçi intro görmediği için hero metnini de
  // beklememeli — fade süresi sıfırlanıp içerik anında açılıyor.
  const contentTransition = reduceMotion
    ? {duration: 0, delay: 0}
    : {duration: 0.8, ease: 'easeOut' as const, delay: 0.15};

  return (
    <>
      <HeroIntro onFinish={handleFinish} />

      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night">
        {/* Intro'nun son karesiyle aynı görsel — overlay kalkarken dikiş görünmez */}
        <div className="absolute inset-0">
          <LayerVisual layer={factoryLayer} priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/20" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-28">
          <motion.div
            initial={false}
            animate={introDone ? {opacity: 1, y: 0} : {opacity: 0, y: 28}}
            transition={contentTransition}
          >
            <p className="mb-4 text-sm font-semibold tracking-[0.35em] text-gold uppercase">
              {t('eyebrow')}
            </p>
            {/* H1 ilk render'dan itibaren DOM'da — arama motoru intro'yu beklemez */}
            <h1 className="font-display text-5xl leading-[0.95] font-bold text-paper text-balance sm:text-7xl lg:text-8xl">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">
              {t('subtitle')}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/bayilik"
                className="group inline-flex items-center gap-3 rounded-full bg-cornel px-8 py-4 text-base font-semibold text-paper shadow-lg shadow-cornel/30 transition hover:bg-cornel-light hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-night"
              >
                {t('cta')}
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <a
                href="#urunler"
                className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-8 py-4 text-base font-medium text-paper transition hover:border-paper/70 hover:bg-paper/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {t('secondaryCta')}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{opacity: 0}}
          animate={introDone ? {opacity: 1} : {opacity: 0}}
          transition={{duration: 0.6, delay: 0.8}}
          className="pointer-events-none absolute right-6 bottom-8 hidden flex-col items-center gap-2 text-paper/50 sm:flex"
        >
          <span className="text-xs tracking-[0.25em] uppercase [writing-mode:vertical-rl]">
            {t('scroll')}
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-paper/50 to-transparent" />
        </motion.div>
      </section>
    </>
  );
}
