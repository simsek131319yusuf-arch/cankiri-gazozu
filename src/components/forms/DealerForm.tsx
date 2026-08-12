'use client';

import {useActionState, useEffect, useRef} from 'react';
import {useFormStatus} from 'react-dom';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {
  sendDealerApplication,
  type DealerFormState
} from '@/app/[locale]/bayilik/actions';

const initialState: DealerFormState = {status: 'idle'};

/**
 * DİKKAT: actions.ts içindeki MAX_LENGTHS ile birebir aynı olmalı.
 * Buradaki sınır sadece kullanıcıya kolaylık; asıl doğrulama sunucuda.
 * ('use server' dosyasından async olmayan değer dışa aktarılamadığı için
 *  liste iki yerde duruyor.)
 */
const MAX_LENGTHS = {
  fullName: 120,
  company: 120,
  city: 120,
  businessLine: 120,
  phone: 32,
  email: 254,
  message: 2000
} as const;

/** Hata özetinde ve odaklamada kullanılan alan sırası (formdaki sıra). */
const FIELD_ORDER = [
  'fullName',
  'company',
  'city',
  'businessLine',
  'phone',
  'email',
  'message',
  'consent'
] as const;

function SubmitButton() {
  const t = useTranslations('dealership.form');
  const {pending} = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-cornel px-8 py-4 text-base font-semibold text-paper transition hover:bg-cornel-light hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      {pending ? t('submitting') : t('submit')}
    </button>
  );
}

export default function DealerForm() {
  const t = useTranslations('dealership.form');
  const locale = useLocale();
  const [state, formAction] = useActionState(sendDealerApplication, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Hata dönünce ilk hatalı alana odaklan: ekran okuyucu ve klavye kullanıcısı
  // sayfanın neresinde ne olduğunu aramasın.
  useEffect(() => {
    if (state.status !== 'error') return;
    const firstField = FIELD_ORDER.find((field) => state.errors?.[field]);
    if (!firstField) return;
    const element = formRef.current?.querySelector<HTMLElement>(`#${firstField}`);
    element?.focus();
  }, [state]);

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-3xl border-2 border-classic/30 bg-classic/5 p-10 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-classic text-2xl text-paper">
          ✓
        </div>
        <h3 className="mt-6 text-xl font-semibold text-ink">{t('successTitle')}</h3>
        <p className="mt-2 text-lg text-ink-2">{state.message}</p>
      </div>
    );
  }

  const fieldErrors = FIELD_ORDER.map((field) => state.errors?.[field]).filter(
    (message): message is string => Boolean(message)
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />

      {/*
        Honeypot: ekrandan da ekran okuyucudan da gizli. `display:none` yerine
        ekran dışına alındı — bazı botlar display:none alanları atlıyor.
        Doldurulursa sunucu başvuruyu sessizce yok sayar.
      */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Web sitesi</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="fullName"
          label={t('fullName')}
          autoComplete="name"
          maxLength={MAX_LENGTHS.fullName}
          defaultValue={state.values?.fullName}
          error={state.errors?.fullName}
          required
        />
        <Field
          name="company"
          label={t('company')}
          autoComplete="organization"
          maxLength={MAX_LENGTHS.company}
          defaultValue={state.values?.company}
          error={state.errors?.company}
          required
        />
        <Field
          name="city"
          label={t('city')}
          autoComplete="address-level2"
          maxLength={MAX_LENGTHS.city}
          defaultValue={state.values?.city}
          error={state.errors?.city}
          required
        />
        <Field
          name="businessLine"
          label={t('businessLine')}
          placeholder={t('businessLinePlaceholder')}
          maxLength={MAX_LENGTHS.businessLine}
          defaultValue={state.values?.businessLine}
          error={state.errors?.businessLine}
          required
        />
        <Field
          name="phone"
          label={t('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={MAX_LENGTHS.phone}
          defaultValue={state.values?.phone}
          error={state.errors?.phone}
          required
        />
        <Field
          name="email"
          label={t('email')}
          type="email"
          autoComplete="email"
          maxLength={MAX_LENGTHS.email}
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-ink-2"
        >
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={MAX_LENGTHS.message}
          defaultValue={state.values?.message}
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className="w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-cornel focus:ring-2 focus:ring-cornel/20"
        />
        {state.errors?.message && (
          <p id="message-error" className="mt-1.5 text-xs text-cornel">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* KVKK açık rızası — onaysız kişisel veri işlenmez. */}
      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            value="evet"
            required
            aria-invalid={state.errors?.consent ? true : undefined}
            aria-describedby={state.errors?.consent ? 'consent-error' : undefined}
            className="mt-1 h-5 w-5 shrink-0 rounded border-ink/30 text-cornel accent-cornel focus:outline-none focus-visible:ring-2 focus-visible:ring-cornel/40"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-ink-2">
            {t('consent')}{' '}
            <Link
              href="/kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cornel underline underline-offset-2 hover:text-cornel-light"
            >
              {t('consentLinkText')}
            </Link>
          </label>
        </div>
        {state.errors?.consent && (
          <p id="consent-error" className="mt-1.5 text-xs text-cornel">
            {state.errors.consent}
          </p>
        )}
      </div>

      {/* Hata özeti: alan hataları sayfada dağınık durduğu için toplu duyurulur. */}
      {state.status === 'error' && (state.message || fieldErrors.length > 0) && (
        <div role="alert" className="space-y-1 text-sm font-medium text-cornel">
          {state.message && <p>{state.message}</p>}
          {fieldErrors.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function Field({
  name,
  label,
  error,
  required,
  ...props
}: {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-ink-2">
        {label}
        {required && <span className="ml-1 text-cornel">*</span>}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-2xl border bg-paper px-4 py-3 text-ink outline-none transition focus:ring-2 ${
          error
            ? 'border-cornel focus:ring-cornel/20'
            : 'border-ink/15 focus:border-cornel focus:ring-cornel/20'
        }`}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-cornel">
          {error}
        </p>
      )}
    </div>
  );
}
