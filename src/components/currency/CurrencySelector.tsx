'use client';

/**
 * Global currency selector.
 *
 * Lives in the site header so the same control is available on every calculator,
 * in Project Mode and on the printable plan. Changing it changes display only —
 * nothing is converted — so the visitor is reminded to re-check the prices they
 * typed. The reminder is announced politely for screen readers and can be
 * dismissed; it auto-clears so it never becomes permanent clutter.
 */
import { useEffect } from 'react';
import { CURRENCY_CODES, currencyOptionLabel, currencyOptionTitle, type CurrencyCode } from '@/lib/currency';
import { useCurrency } from './CurrencyProvider';

const REMINDER_TIMEOUT_MS = 9000;

/** Reminder shown after a currency switch: the amounts on screen were re-formatted, not converted. */
export function CurrencyChangeToast({ code, onDismiss }: { code: CurrencyCode; onDismiss: () => void }) {
  return (
    <div className="currency-toast" role="status">
      <strong>Currency changed to {code}.</strong> Review your price inputs — amounts are not converted.
      <button type="button" className="currency-toast-dismiss" onClick={onDismiss}>Dismiss</button>
    </div>
  );
}

export function CurrencySelector() {
  const { code, currency, selectCurrency, changed, acknowledgeChange } = useCurrency();

  useEffect(() => {
    if (!changed) return;
    const timer = window.setTimeout(acknowledgeChange, REMINDER_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [changed, acknowledgeChange]);

  return (
    <>
      <div className="currency-picker">
        <label className="currency-picker-label" htmlFor="currency-select">Currency</label>
        <select
          id="currency-select"
          className="input select currency-select"
          value={code}
          title={`Display currency: ${currency.code} — ${currency.name}`}
          aria-label={`Display currency (currently ${currency.code} — ${currency.name})`}
          onChange={(event) => selectCurrency(event.target.value)}
        >
          {CURRENCY_CODES.map((option) => (
            <option key={option} value={option} title={currencyOptionTitle(option)}>
              {currencyOptionLabel(option)}
            </option>
          ))}
        </select>
      </div>
      {changed ? <CurrencyChangeToast code={code} onDismiss={acknowledgeChange} /> : null}
    </>
  );
}
