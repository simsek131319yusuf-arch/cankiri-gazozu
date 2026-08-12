import 'server-only';
import {appendFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {site} from '@/data/site';
import type {DealerApplication} from '@/data/types';

/**
 * Bayilik başvurusunun TEK giriş kapısı.
 *
 * Sıra bilerek böyle: ÖNCE kalıcı kayıt, SONRA bildirim e-postası.
 * E-posta servisi çökse bile başvuru kaybolmaz; tersi mümkün değil.
 *
 * KİŞİSEL VERİ KURALI: ad, telefon, e-posta, firma HİÇBİR log satırına
 * yazılmaz. Loglarda yalnızca başvuru kimliği ve zaman damgası bulunur —
 * sunucu logları KVKK anlamında kalıcı bir kayıt ortamıdır.
 */

/** Deponun dosya adı — testler ve ileride admin paneli buradan okuyacak. */
export const DEALER_STORE_FILENAME = 'dealer-applications.jsonl';

/** Resend çağrısı bu süreyi aşarsa iptal edilir (form sonsuza kadar beklemesin). */
const MAIL_TIMEOUT_MS = 10_000;

export type DealerSubmitResult = {
  ok: boolean;
  /**
   * 'not-configured' → üretimde ne depo ne e-posta ayarlı; başvuru hiçbir
   *                    yere ulaşmıyor demektir, kullanıcıya sahte başarı yok.
   * 'store-failed'   → dosyaya yazılamadı ama e-posta gitti (ok: true).
   */
  reason?: 'not-configured' | 'store-failed';
};

/**
 * Kalıcı deponun dizini.
 *
 * ÇOK ÖNEMLİ UYARI — SERVERLESS ORTAM:
 * Vercel gibi serverless platformlarda dosya sistemi GEÇİCİDİR; yazılan dosya
 * bir sonraki isteğe/deploy'a kalmaz ve örnekler arasında paylaşılmaz. Bu
 * JSONL deposu yalnızca "başvuru hiçbir yere gitmesin" diye konmuş bir
 * köprüdür. Üretimde gerçek bir veritabanı ya da harici depo (Postgres,
 * Airtable, S3...) bağlanana kadar dosya deposuna GÜVENİLMEMELİDİR.
 * Bu yüzden üretimde varsayılan dizin yoktur: DEALER_STORE_DIR bilinçli
 * olarak (kalıcı bir disk/volume gösterecek şekilde) verilmek zorundadır.
 */
function resolveStoreDir(): string | null {
  const configured = process.env.DEALER_STORE_DIR?.trim();
  if (configured) return path.resolve(configured);
  // Geliştirmede elle ayar gerekmesin diye proje kökündeki .data/ kullanılır.
  if (process.env.NODE_ENV === 'production') return null;
  return path.resolve(process.cwd(), '.data');
}

/** Depoya yazılan satırın şekli — DB'ye geçildiğinde tablo kolonları bunlar olacak. */
type StoredApplication = DealerApplication & {
  id: string;
  receivedAt: string;
};

/**
 * Append-only JSONL: her satır bir başvuru. Bozuk bir satır diğerlerini
 * okunamaz hale getirmesin diye tek bir büyük JSON dizisi TUTULMUYOR.
 */
async function persistApplication(record: StoredApplication): Promise<boolean> {
  const dir = resolveStoreDir();
  if (!dir) return false;

  try {
    await mkdir(dir, {recursive: true});
    await appendFile(
      path.join(dir, DEALER_STORE_FILENAME),
      `${JSON.stringify(record)}\n`,
      'utf8'
    );
    return true;
  } catch (error) {
    // Kişisel veri yok: yalnızca kimlik ve hata mesajı.
    console.error(
      `[bayilik] başvuru diske yazılamadı (id: ${record.id}, ${record.receivedAt}):`,
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

/** Bildirim e-postası. Servis hatası kaydı geçersiz kılmaz, sadece raporlanır. */
async function sendNotificationMail(record: StoredApplication): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      // Servis takılırsa istek sonsuza kadar beklemesin.
      signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
      body: JSON.stringify({
        from:
          process.env.DEALER_MAIL_FROM ?? 'Çankırı Gazozu <onboarding@resend.dev>',
        to: [process.env.DEALER_MAIL_TO ?? site.dealerEmail],
        reply_to: record.email || undefined,
        subject: `Bayilik başvurusu — ${record.fullName} (${record.city})`,
        text: [
          `Başvuru no: ${record.id}`,
          `Tarih: ${record.receivedAt}`,
          '',
          `Ad Soyad: ${record.fullName}`,
          `Firma: ${record.company}`,
          `Şehir: ${record.city}`,
          `İş kolu: ${record.businessLine}`,
          `Telefon: ${record.phone}`,
          `E-posta: ${record.email || '-'}`,
          '',
          record.message || ''
        ].join('\n')
      })
    });

    if (!response.ok) {
      // Yanıt gövdesi başvuru verisi içermez, sadece Resend'in hata mesajıdır.
      console.error(
        `[bayilik] e-posta gönderilemedi (id: ${record.id}, HTTP ${response.status}):`,
        await response.text().catch(() => '')
      );
      return false;
    }
    return true;
  } catch (error) {
    // Timeout (AbortError) ve ağ hataları burada yakalanır.
    console.error(
      `[bayilik] e-posta servisine ulaşılamadı (id: ${record.id}):`,
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

/**
 * İmza PROJE KURALIDIR (bkz. DEVIR-NOTU §1.1): sayfalar ve form bileşeni
 * yalnızca bu fonksiyonu tanır. Veritabanına geçildiğinde SADECE bu gövde
 * değişecek, çağıran hiçbir dosyaya dokunulmayacak.
 */
export async function submitDealerApplication(
  application: DealerApplication
): Promise<DealerSubmitResult> {
  const record: StoredApplication = {
    ...application,
    id: randomUUID(),
    receivedAt: new Date().toISOString()
  };

  // TODO(admin): admin paneli/veritabanı gelince kalıcı kayıt buraya taşınacak:
  // await db.dealerApplication.create({data: record});
  const stored = await persistApplication(record);
  const mailed = await sendNotificationMail(record);

  if (stored) {
    // E-posta gitmese bile başvuru duruyor: kullanıcı açısından başarılı.
    return {ok: true};
  }

  if (mailed) {
    return {ok: true, reason: 'store-failed'};
  }

  // ÜRETİMDE SAHTE BAŞARI YOK: başvuru hiçbir yere ulaşmadıysa kullanıcı
  // bunu bilmeli, aksi halde gerçek bir bayilik talebi sessizce kaybolur.
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[bayilik] YAPILANDIRMA HATASI: başvuru hiçbir yere kaydedilemedi. ' +
        'DEALER_STORE_DIR (kalıcı disk) ve/veya RESEND_API_KEY tanımlanmalı. ' +
        `Kaybedilen başvuru id: ${record.id} (${record.receivedAt}).`
    );
    return {ok: false, reason: 'not-configured'};
  }

  // Geliştirme: e-posta ayarı olmadan formu denemek serbest.
  console.warn(
    `[bayilik] geliştirme modu — başvuru kalıcı olarak kaydedilemedi (id: ${record.id}).`
  );
  return {ok: true, reason: 'store-failed'};
}
