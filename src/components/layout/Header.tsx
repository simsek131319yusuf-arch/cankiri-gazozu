'use client';

import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {useFocusTrap} from '@/hooks/useFocusTrap';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Masaüstünde altı link üst barı kalabalıklaştırıyor: logo, menü ve dil
 * değiştirici 1024 px altında birbirine giriyor. Bu yüzden masaüstünde
 * ticari önceliğe göre dört başlık duruyor (Ürünler, Fabrikamız, Hikâyemiz,
 * Bayilik). S.S.S. ve İletişim mobil menüde tam listede yer alıyor ve zaten
 * footer'dan her sayfada erişilebilir — arama motorları için iç link kaybı yok.
 */
const navItems = [
  {href: '/urunler', key: 'products', desktop: true},
  {href: '/hakkimizda', key: 'about', desktop: true},
  {href: '/hikayemiz', key: 'story', desktop: true},
  {href: '/bayilik', key: 'dealership', desktop: true},
  {href: '/sss', key: 'faq', desktop: false},
  {href: '/iletisim', key: 'contact', desktop: false}
] as const;

const MOBILE_MENU_ID = 'mobil-menu';

/** Scroll durumunu React state'i yerine dış kaynak olarak okur (cascading render yok). */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, {passive: true});
  return () => window.removeEventListener('scroll', onChange);
}

/**
 * Aktif sayfa kontrolü. usePathname yerelleştirilmemiş (kanonik) yolu döner,
 * dinamik segmentler de şablon hâlinde gelir: /urunler/kizilcik-gazozu için
 * '/urunler/[slug]'. Bu yüzden alt sayfalarda üst başlığı aktif saymak için
 * önek kontrolü yapılıyor.
 */
function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const t = useTranslations('nav');
  const a11y = useTranslations('a11y');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 24,
    () => false
  );

  const onHome = pathname === '/';
  // Ana sayfada hero koyu olduğu için başlangıçta şeffaf/açık metin kullanılır.
  // Menü açıkken perde devreye girdiği için şeffaf başlık okunmaz olurdu.
  const transparent = onHome && !scrolled && !open;

  // Rota değişince menü KESİN kapansın: onClick yetmiyor, çünkü menü içinden
  // yapılan her gezinme (dil değiştirici, CTA, tarayıcı geri tuşu) tıklamayla
  // sonuçlanmıyor.
  //
  // Bu, effect değil "render sırasında state düzeltme" desenidir: effect'te
  // setState çağırmak fazladan bir render turu ve menünün bir kare boyunca
  // yeni sayfanın üstünde açık kalması demekti. React bu düzeltmeyi DOM'a
  // hiç boyamadan aynı turda uyguluyor.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Menü açıkken arka sayfa kaymasın. Kilit CSS'te (globals.css) duruyor;
  // burada yalnızca işaret veriliyor ve kapanışta temizleniyor.
  useEffect(() => {
    if (!open) return;
    document.body.dataset.menu = 'open';
    return () => {
      delete document.body.dataset.menu;
    };
  }, [open]);

  // Escape ile kapat
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Tab odağı menünün içinde dönsün, kapanınca odak menü düğmesine geri gelsin.
  useFocusTrap(menuRef, open, toggleRef);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        transparent
          ? 'bg-transparent py-5'
          : 'border-b border-ink/10 bg-paper/90 py-3 backdrop-blur-md'
      }`}
    >
      {/* DOM'daki ilk odaklanabilir öğe olmak zorunda: klavye kullanıcısı
          sayfaya girer girmez menüyü atlayıp içeriğe geçebilsin. */}
      <a href="#content" className="skip-link">
        {a11y('skipToContent')}
      </a>

      {/* Mobil menü perdesi. Header'ın ilk görsel katmanı olduğu için sonraki
          kardeşleri (üst bar ve menü) onun üstünde boyanıyor, z-index gerekmiyor. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-night/50 backdrop-blur-[2px] transition-opacity duration-200 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

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

        <nav aria-label={a11y('mainNav')} className="hidden items-center gap-8 md:flex">
          {navItems
            .filter((item) => item.desktop)
            .map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm font-medium transition hover:text-cornel ${
                    active
                      ? transparent
                        ? 'text-paper underline decoration-gold decoration-2 underline-offset-8'
                        : 'text-cornel underline decoration-cornel decoration-2 underline-offset-8'
                      : transparent
                        ? 'text-paper/85'
                        : 'text-ink-2'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          <LanguageSwitcher dark={transparent} />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher dark={transparent} />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
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
        <nav
          ref={menuRef}
          id={MOBILE_MENU_ID}
          aria-label={a11y('mobileNav')}
          className="relative border-t border-ink/10 bg-paper px-6 py-4 md:hidden"
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`block border-l-2 py-3 pl-3 text-base font-medium transition ${
                  active
                    ? 'border-cornel text-cornel'
                    : 'border-transparent text-ink-2'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}

          {/* Mobilde asıl dönüşüm hedefi bayilik başvurusu; menüdeki link
              listesinde kaybolmasın diye ayrı bir CTA olarak duruyor. */}
          <Link
            href="/bayilik"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-cornel px-5 py-3 text-center text-base font-semibold text-paper transition hover:bg-cornel/90"
          >
            {t('dealerCta')}
          </Link>
        </nav>
      )}
    </header>
  );
}
