/**
 * Bağımlılıksız, bellek içi "sliding window" hız sınırlayıcı.
 *
 * DİKKAT — TEK SUNUMCU VARSAYIMI:
 * Sayaç yalnızca bu Node işleminin belleğinde tutulur. Vercel gibi çok örnekli
 * (serverless / birden fazla instance) bir ortamda her örneğin kendi sayacı
 * olur ve gerçek sınır "limit × örnek sayısı" kadar gevşer. Ayrıca işlem her
 * yeniden başladığında sayaç sıfırlanır.
 * Gerçek koruma gerektiğinde Upstash Redis gibi PAYLAŞILAN bir depoya
 * geçilmeli; bu dosyanın imzası aynı kalacak şekilde yazıldı.
 *
 * Yeni bir runtime bağımlılığı eklenmesin diye bilerek kütüphanesiz yazıldı.
 */

export type RateLimitOptions = {
  /** Pencere içinde izin verilen deneme sayısı */
  limit?: number;
  /** Pencere uzunluğu (ms) */
  windowMs?: number;
  /** Testlerde zamanı ileri sarabilmek için — üretimde verilmez */
  now?: number;
};

export type RateLimitResult = {
  ok: boolean;
  /** Pencerede kalan hak (kayıt işlendikten sonra) */
  remaining: number;
  /** Sınır aşıldıysa tekrar denenebilecek ana kalan süre (ms) */
  retryAfterMs: number;
};

/** Bayilik formu için varsayılan: 15 dakikada 3 gönderim */
const DEFAULT_LIMIT = 3;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;

/** anahtar → pencere içindeki deneme zaman damgaları (artan sırada) */
const hits = new Map<string, number[]>();

/**
 * Haritanın sınırsız büyümemesi için ara sıra süpürülür: her çağrıda tüm
 * anahtarları gezmek pahalı olurdu, bu yüzden sayaçla seyrelttik.
 */
let callsSinceSweep = 0;
const SWEEP_EVERY = 200;

function prune(timestamps: number[], now: number, windowMs: number): number[] {
  const floor = now - windowMs;
  // Damgalar artan sırada eklendiği için baştan kırpmak yeterli.
  let index = 0;
  while (index < timestamps.length && timestamps[index] <= floor) index += 1;
  return index === 0 ? timestamps : timestamps.slice(index);
}

function sweep(now: number, windowMs: number) {
  callsSinceSweep += 1;
  if (callsSinceSweep < SWEEP_EVERY) return;
  callsSinceSweep = 0;
  for (const [key, timestamps] of hits) {
    const kept = prune(timestamps, now, windowMs);
    if (kept.length === 0) hits.delete(key);
    else hits.set(key, kept);
  }
}

/**
 * Sadece BAKAR: sınır aşılmış mı diye kontrol eder, deneme kaydetmez.
 * Doğrulama hatalarının kullanıcının hakkını yemesini istemiyoruz.
 */
export function isRateLimited(key: string, options: RateLimitOptions = {}): RateLimitResult {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = options.now ?? Date.now();

  const timestamps = prune(hits.get(key) ?? [], now, windowMs);
  if (timestamps.length > 0) hits.set(key, timestamps);

  const exceeded = timestamps.length >= limit;
  return {
    ok: !exceeded,
    remaining: Math.max(0, limit - timestamps.length),
    retryAfterMs: exceeded ? timestamps[0] + windowMs - now : 0
  };
}

/**
 * BAKAR ve KAYDEDER: sınır aşılmadıysa denemeyi deftere yazar.
 * Sınır aşıldığında yeni damga eklenmez — aksi halde pencere sürekli
 * ileri kayar ve kullanıcı bir daha hiç giremezdi.
 */
export function consumeRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = options.now ?? Date.now();

  sweep(now, windowMs);

  const timestamps = prune(hits.get(key) ?? [], now, windowMs);
  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return {ok: false, remaining: 0, retryAfterMs: timestamps[0] + windowMs - now};
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return {ok: true, remaining: limit - timestamps.length, retryAfterMs: 0};
}

/** Testler ve geliştirme içindir — üretim akışında çağrılmaz. */
export function resetRateLimits() {
  hits.clear();
  callsSinceSweep = 0;
}
