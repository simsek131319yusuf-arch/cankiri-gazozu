'use server';

import {getTranslations} from 'next-intl/server';
import {submitDealerApplication} from '@/lib/dealer';
import type {DealerApplication} from '@/data/types';

export type DealerFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Partial<Record<keyof DealerApplication, string>>;
};

const REQUIRED_FIELDS = [
  'fullName',
  'company',
  'city',
  'businessLine',
  'phone'
] as const;

export async function sendDealerApplication(
  _previous: DealerFormState,
  formData: FormData
): Promise<DealerFormState> {
  const locale = String(formData.get('locale') || 'tr');
  const t = await getTranslations({locale, namespace: 'dealership.form'});

  const read = (key: string) => String(formData.get(key) ?? '').trim();

  const application: DealerApplication = {
    fullName: read('fullName'),
    company: read('company'),
    city: read('city'),
    businessLine: read('businessLine'),
    phone: read('phone'),
    email: read('email') || undefined,
    message: read('message') || undefined
  };

  // Doğrulama sunucuda yapılır — tarayıcıdaki `required` sadece kolaylık.
  const errors: DealerFormState['errors'] = {};
  for (const field of REQUIRED_FIELDS) {
    if (!application[field]) errors[field] = t('required');
  }
  if (application.phone && application.phone.replace(/\D/g, '').length < 10) {
    errors.phone = t('invalidPhone');
  }
  if (application.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
    errors.email = t('invalidEmail');
  }

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const result = await submitDealerApplication(application);
  return result.ok
    ? {status: 'success', message: t('success')}
    : {status: 'error', message: t('error')};
}
