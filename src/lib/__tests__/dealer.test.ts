import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {DEALER_STORE_FILENAME, submitDealerApplication} from '@/lib/dealer';
import type {DealerApplication} from '@/data/types';

const application: DealerApplication = {
  fullName: 'Test Kullanıcı',
  company: 'Test Gıda Ltd.',
  city: 'Çankırı',
  businessLine: 'Market',
  phone: '+90 555 111 22 33',
  email: 'test@example.com',
  message: 'Bayilik hakkında bilgi almak istiyorum.'
};

// vi.stubEnv kullanılıyor: hem geliştiricinin kendi .env değerlerinden
// etkilenmeyi engelliyor hem de NODE_ENV'i (tipçe salt okunur) ayarlatıyor.
const ENV_KEYS = [
  'DEALER_STORE_DIR',
  'RESEND_API_KEY',
  'DEALER_MAIL_TO',
  'DEALER_MAIL_FROM'
] as const;

let storeDir: string | undefined;

async function readStoredLines(dir: string) {
  const raw = await readFile(path.join(dir, DEALER_STORE_FILENAME), 'utf8');
  return raw
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

describe('submitDealerApplication', () => {
  beforeEach(async () => {
    for (const key of ENV_KEYS) vi.stubEnv(key, undefined);
    storeDir = await mkdtemp(path.join(tmpdir(), 'bayilik-'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(async () => {
    if (storeDir) await rm(storeDir, {recursive: true, force: true});
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('başvuruyu JSONL deposuna yazar ve geri okunabilir', async () => {
    vi.stubEnv('DEALER_STORE_DIR', storeDir);

    const result = await submitDealerApplication(application);
    expect(result.ok).toBe(true);

    const lines = await readStoredLines(storeDir!);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject(application);
    expect(typeof lines[0].id).toBe('string');
    expect(Number.isNaN(Date.parse(lines[0].receivedAt))).toBe(false);
  });

  it('art arda gelen başvurular dosyaya eklenir (append-only)', async () => {
    vi.stubEnv('DEALER_STORE_DIR', storeDir);

    await submitDealerApplication(application);
    await submitDealerApplication({...application, city: 'Çorum'});

    const lines = await readStoredLines(storeDir!);
    expect(lines).toHaveLength(2);
    expect(lines[1].city).toBe('Çorum');
  });

  it('e-posta servisi hata verse bile kayıt korunur ve ok:true döner', async () => {
    vi.stubEnv('DEALER_STORE_DIR', storeDir);
    vi.stubEnv('RESEND_API_KEY', 're_test');
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitDealerApplication(application);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.ok).toBe(true);
    expect(await readStoredLines(storeDir!)).toHaveLength(1);
    // Yönetici görebilsin diye hata konsola basılır...
    expect(console.error).toHaveBeenCalled();
    // ...ama içinde kişisel veri olmaz.
    const logged = vi.mocked(console.error).mock.calls.flat().join(' ');
    expect(logged).not.toContain(application.fullName);
    expect(logged).not.toContain(application.phone);
    expect(logged).not.toContain(application.email);
  });

  it('e-posta 4xx dönerse de kayıt korunur', async () => {
    vi.stubEnv('DEALER_STORE_DIR', storeDir);
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        text: async () => 'domain not verified'
      })
    );

    const result = await submitDealerApplication(application);
    expect(result.ok).toBe(true);
    expect(await readStoredLines(storeDir!)).toHaveLength(1);
  });

  it('üretimde hiçbir şey yapılandırılmamışsa ok:false döner', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    // DEALER_STORE_DIR ve RESEND_API_KEY bilerek tanımsız.
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitDealerApplication(application);

    expect(result).toEqual({ok: false, reason: 'not-configured'});
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('üretimde depo yazılamasa bile e-posta gittiyse başvuru kabul edilir', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, status: 200}));

    const result = await submitDealerApplication(application);
    expect(result).toEqual({ok: true, reason: 'store-failed'});
  });
});
