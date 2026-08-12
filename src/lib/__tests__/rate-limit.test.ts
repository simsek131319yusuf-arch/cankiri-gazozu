import {beforeEach, describe, expect, it} from 'vitest';
import {consumeRateLimit, isRateLimited, resetRateLimits} from '@/lib/rate-limit';

// Zaman `now` seçeneğiyle elle verildiği için testler gerçek saate bağlı değil.
const WINDOW = 15 * 60 * 1000;
const options = (now: number) => ({limit: 3, windowMs: WINDOW, now});

describe('rate-limit', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it('limit içindeki denemelere izin verir', () => {
    const key = 'test:1';
    expect(consumeRateLimit(key, options(0)).ok).toBe(true);
    expect(consumeRateLimit(key, options(1_000)).ok).toBe(true);
    const third = consumeRateLimit(key, options(2_000));
    expect(third.ok).toBe(true);
    expect(third.remaining).toBe(0);
  });

  it('limit aşılınca reddeder ve tekrar deneme süresi bildirir', () => {
    const key = 'test:2';
    consumeRateLimit(key, options(0));
    consumeRateLimit(key, options(1_000));
    consumeRateLimit(key, options(2_000));

    const blocked = consumeRateLimit(key, options(3_000));
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBe(WINDOW - 3_000);
  });

  it('pencere kayınca yeniden izin verir', () => {
    const key = 'test:3';
    consumeRateLimit(key, options(0));
    consumeRateLimit(key, options(1_000));
    consumeRateLimit(key, options(2_000));
    expect(consumeRateLimit(key, options(3_000)).ok).toBe(false);

    // İlk damga pencereden çıktığı anda bir hak açılır.
    expect(consumeRateLimit(key, options(WINDOW + 1)).ok).toBe(true);
  });

  it('anahtarlar birbirini etkilemez', () => {
    consumeRateLimit('test:a', options(0));
    consumeRateLimit('test:a', options(0));
    consumeRateLimit('test:a', options(0));
    expect(consumeRateLimit('test:a', options(0)).ok).toBe(false);
    expect(consumeRateLimit('test:b', options(0)).ok).toBe(true);
  });

  it('isRateLimited sadece bakar, hak düşmez', () => {
    const key = 'test:peek';
    expect(isRateLimited(key, options(0)).ok).toBe(true);
    expect(isRateLimited(key, options(0)).ok).toBe(true);
    expect(isRateLimited(key, options(0)).remaining).toBe(3);
  });
});
