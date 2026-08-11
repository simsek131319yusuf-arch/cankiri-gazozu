'use client';

import {useActionState} from 'react';
import {useFormStatus} from 'react-dom';
import {useLocale, useTranslations} from 'next-intl';
import {
  sendDealerApplication,
  type DealerFormState
} from '@/app/[locale]/bayilik/actions';

const initialState: DealerFormState = {status: 'idle'};

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

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-3xl border-2 border-classic/30 bg-classic/5 p-10 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-classic text-2xl text-paper">
          ✓
        </div>
        <p className="mt-6 text-lg font-medium text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="fullName" label={t('fullName')} error={state.errors?.fullName} required />
        <Field name="company" label={t('company')} error={state.errors?.company} required />
        <Field name="city" label={t('city')} error={state.errors?.city} required />
        <Field
          name="businessLine"
          label={t('businessLine')}
          placeholder={t('businessLinePlaceholder')}
          error={state.errors?.businessLine}
          required
        />
        <Field
          name="phone"
          label={t('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={state.errors?.phone}
          required
        />
        <Field
          name="email"
          label={t('email')}
          type="email"
          autoComplete="email"
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
          className="w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-cornel focus:ring-2 focus:ring-cornel/20"
        />
      </div>

      {state.status === 'error' && state.message && (
        <p role="alert" className="text-sm font-medium text-cornel">
          {state.message}
        </p>
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
