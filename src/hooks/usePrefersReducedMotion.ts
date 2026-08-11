'use client';

import {useSyncExternalStore} from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * SSR-güvenli hareket tercihi okuma.
 *
 * motion'ın kendi useReducedMotion'ı ilk istemci render'ında gerçek değeri
 * döndürüp sunucu HTML'iyle uyuşmazlık (hydration mismatch) üretiyordu.
 * useSyncExternalStore sunucu anlık görüntüsünü ayrı verdiği için React bu
 * geçişi güvenle yönetir.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function read() {
  return window.matchMedia(QUERY).matches;
}
