import 'server-only';
import {site} from '@/data/site';
import type {DealerApplication} from '@/data/types';

/**
 * Bayilik başvurusunun TEK giriş kapısı.
 *
 * Bugün: e-posta olarak Yusuf'a düşüyor (RESEND_API_KEY yoksa sadece loglanıyor).
 * Admin paneli gelince: bu fonksiyonun içine DB kaydı eklenecek, form bileşenine
 * hiç dokunulmayacak.
 */
export async function submitDealerApplication(
  application: DealerApplication
): Promise<{ok: boolean}> {
  // TODO(admin): await db.dealerApplication.create({data: application});

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Demo/geliştirme ortamı: başvuruyu kaybetmeyelim, en azından log'a düşsün.
    console.info('[bayilik] başvuru alındı (e-posta kapalı):', application);
    return {ok: true};
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.DEALER_MAIL_FROM ?? 'Çankırı Gazozu <onboarding@resend.dev>',
      to: [process.env.DEALER_MAIL_TO ?? site.dealerEmail],
      reply_to: application.email || undefined,
      subject: `Bayilik başvurusu — ${application.fullName} (${application.city})`,
      text: [
        `Ad Soyad: ${application.fullName}`,
        `Firma: ${application.company}`,
        `Şehir: ${application.city}`,
        `İş kolu: ${application.businessLine}`,
        `Telefon: ${application.phone}`,
        `E-posta: ${application.email || '-'}`,
        '',
        application.message || ''
      ].join('\n')
    })
  });

  if (!response.ok) {
    console.error('[bayilik] e-posta gönderilemedi:', await response.text());
    return {ok: false};
  }

  return {ok: true};
}
