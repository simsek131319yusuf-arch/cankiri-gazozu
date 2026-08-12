'use server';

import {headers} from 'next/headers';
import {getTranslations} from 'next-intl/server';
import {submitDealerApplication} from '@/lib/dealer';
import {consumeRateLimit, isRateLimited} from '@/lib/rate-limit';
import {routing} from '@/i18n/routing';
import type {DealerApplication} from '@/data/types';

/**
 * `consent` (KVKK onayı) DealerApplication'da yok — o bir form alanı, kayıt
 * alanı değil. Bu yüzden hata anahtarları başvuru alanlarından bir fazla.
 */
export type DealerFormField = keyof DealerApplication | 'consent';

export type DealerFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Partial<Record<DealerFormField, string>>;
  /**
   * Doğrulama hatasında kullanıcının yazdıkları kaybolmasın diye forma geri
   * beslenir (React `defaultValue`). Başarıda geri gönderilmez.
   */
  values?: Partial<Record<DealerFormField, string>>;
};

const REQUIRED_FIELDS = [
  'fullName',
  'company',
  'city',
  'businessLine',
  'phone'
] as const;

/**
 * Sunucu tarafı maksimum uzunluklar. İstemcideki `maxLength` sadece kolaylık;
 * asıl sınır burası.
 * DİKKAT: DealerForm.tsx içindeki MAX_LENGTHS ile birebir aynı kalmalı
 * ('use server' dosyasından async olmayan değer dışa aktarılamıyor).
 */
const MAX_LENGTHS: Record<keyof DealerApplication, number> = {
  fullName: 120,
  company: 120,
  city: 120,
  businessLine: 120,
  phone: 32,
  email: 254,
  message: 2000
};

/** Telefonda kabul edilen karakterler: rakam, boşluk, +, -, parantez. */
const PHONE_ALLOWED = /^[0-9+\-()\s]+$/;
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;

/**
 * Hız sınırı anahtarı. Vekil sunucu arkasında gerçek istemci IP'si
 * x-forwarded-for'un İLK değeridir; sonrakiler ara vekillerdir.
 * Başlık hiç yoksa (yerel geliştirme) herkes tek bir kovaya düşer.
 */
async function rateLimitKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip')?.trim() ||
    '';
  return `bayilik:${ip || 'bilinmeyen'}`;
}

export async function sendDealerApplication(
  _previous: DealerFormState,
  formData: FormData
): Promise<DealerFormState> {
  // İstemciden gelen locale doğrulanmadan getTranslations'a verilirse
  // geçersiz değer 500 üretir. İzinli diller dışındaysa varsayılana düşülür.
  const rawLocale = String(formData.get('locale') ?? '');
  const locale = (routing.locales as readonly string[]).includes(rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({locale, namespace: 'dealership.form'});

  const read = (key: string) => String(formData.get(key) ?? '').trim();

  // Honeypot: gerçek kullanıcı bu alanı ne görür ne de doldurabilir.
  // Doluysa bot demektir — hata göstermeyip sessizce "başarı" döneriz ki
  // bot hangi kontrole takıldığını öğrenip formu ayarlayamasın.
  if (read('website')) {
    return {status: 'success', message: t('success')};
  }

  const application: DealerApplication = {
    fullName: read('fullName'),
    company: read('company'),
    city: read('city'),
    businessLine: read('businessLine'),
    phone: read('phone'),
    email: read('email') || undefined,
    message: read('message') || undefined
  };
  const consent = formData.get('consent') != null;

  // Hata durumunda formu yeniden doldurmak için ham değerler.
  const values: DealerFormState['values'] = {
    fullName: application.fullName,
    company: application.company,
    city: application.city,
    businessLine: application.businessLine,
    phone: application.phone,
    email: application.email ?? '',
    message: application.message ?? ''
  };

  const key = await rateLimitKey();
  // Önce sadece BAKILIR: yazım hatası yüzünden dönen kullanıcı hakkını
  // yakmasın, sayaç yalnızca gerçekten gönderilen başvuruda işlensin.
  if (!isRateLimited(key).ok) {
    return {status: 'error', message: t('rateLimited'), values};
  }

  // Doğrulama sunucuda yapılır — tarayıcıdaki `required` sadece kolaylık.
  const errors: DealerFormState['errors'] = {};
  for (const field of REQUIRED_FIELDS) {
    if (!application[field]) errors[field] = t('required');
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS) as [
    keyof DealerApplication,
    number
  ][]) {
    const value = application[field];
    if (value && value.length > max) errors[field] = t('tooLong', {max});
  }

  if (application.phone && !errors.phone) {
    const digits = application.phone.replace(/\D/g, '').length;
    if (
      !PHONE_ALLOWED.test(application.phone) ||
      digits < PHONE_MIN_DIGITS ||
      digits > PHONE_MAX_DIGITS
    ) {
      errors.phone = t('invalidPhone');
    }
  }

  if (
    application.email &&
    !errors.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)
  ) {
    errors.email = t('invalidEmail');
  }

  // KVKK açık rızası olmadan kişisel veri işlenmez.
  if (!consent) {
    errors.consent = t('consentRequired');
  }

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors, values};
  }

  // Buradan sonrası gerçek bir gönderim: hak şimdi düşülür.
  if (!consumeRateLimit(key).ok) {
    return {status: 'error', message: t('rateLimited'), values};
  }

  const result = await submitDealerApplication(application);
  return result.ok
    ? {status: 'success', message: t('success')}
    : {status: 'error', message: t('error'), values};
}
