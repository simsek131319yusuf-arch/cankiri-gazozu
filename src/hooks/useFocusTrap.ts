'use client';

import {useEffect, type RefObject} from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * Açık bir katmanda (mobil menü gibi) Tab odağını katmanın içinde döndürür,
 * katman kapanınca odağı geldiği yere — tercihen katmanı açan düğmeye — verir.
 *
 * Hazır bir focus trap kütüphanesi eklenmedi: ihtiyaç tek bir katmanla sınırlı,
 * bağımlılık maliyetine değmiyor.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  restoreTo?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    // Katman kapanınca odağın döneceği yer: verilmişse düğme, yoksa son odak.
    // Her ikisi de temizlik anında değil, AÇILIŞ anında saptanıyor: ref.current
    // temizlik çalıştığında başka bir düğümü gösteriyor olabilir.
    const previous = document.activeElement as HTMLElement | null;
    const restoreTarget = restoreTo?.current ?? previous;

    // Gizli öğeler (display:none, henüz açılmamış alt menü) Tab dizisinde yok.
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0
      );

    // Açılışta odağı içeri al; aksi halde ilk Tab kullanıcıyı katmanın dışına atar.
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const outside = !current || !container.contains(current);

      if (event.shiftKey && (outside || current === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (outside || current === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreTarget?.focus();
    };
  }, [ref, active, restoreTo]);
}
