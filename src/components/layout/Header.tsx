'use client';

import {useState, useSyncExternalStore} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const navItems = [
  {href: '/urunler', key: 'products'},
  {href: '/hakkimizda', key: 'about'},
  {href: '/bayilik', key: 'dealership'}
] as const;

/** Scroll durumunu React state'i yerine dış kaynak olarak okur (cascading render yok). */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, {passive: true});
  return () => window.removeEventListener('scroll', onChange);
}

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 24,
    () => false
  );

  const onHome = pathname === '/';
  // Ana sayfada hero koyu olduğu için başlangıçta şeffaf/açık metin kullanılır.
  const transparent = onHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        transparent
          ? 'bg-transparent py-5'
          : 'border-b border-ink/10 bg-paper/90 py-3 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Çankırı Gazozu"
            width={1024}
            height={1024}
            priority
            sizes="44px"
            className="h-11 w-11 object-contain"
          />
          <span
            className={`font-display text-lg leading-tight font-bold tracking-tight ${
              transparent ? 'text-paper' : 'text-ink'
            }`}
          >
            Çankırı
            <span className="block text-[11px] font-semibold tracking-[0.35em] text-cornel uppercase">
              Gazozu
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition hover:text-cornel ${
                transparent ? 'text-paper/85' : 'text-ink-2'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          <LanguageSwitcher dark={transparent} />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher dark={transparent} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t('close') : t('menu')}
            className={`rounded-lg border p-2 ${
              transparent ? 'border-paper/30 text-paper' : 'border-ink/15 text-ink'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-paper px-6 py-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-ink-2"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
