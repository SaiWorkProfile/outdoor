'use client';

/**
 * Renderers for money.
 *
 * `CurrencyText` formats a single amount in the selected currency; `CurrencyRichText`
 * renders content-library values (plain text, or text interleaved with money parts)
 * the same way. Both live on the client so switching currency re-formats what is on
 * screen without a round trip and without any stored value changing.
 */
import type { ReactNode } from 'react';
import { isMoneyAmount, type CurrencyTextPart, type CurrencyTextValue } from '@/lib/currency/money-value';
import { useCurrency } from './CurrencyProvider';

export function CurrencyText({ amount, digits }: { amount: number; digits?: number }) {
  const { format } = useCurrency();
  return <>{format(amount, digits)}</>;
}

export function CurrencyRichText({ value }: { value: CurrencyTextValue | undefined }) {
  const { format } = useCurrency();
  return <>{renderParts(value, format)}</>;
}

function renderParts(value: CurrencyTextValue | undefined, format: (amount: number, digits?: number) => string): ReactNode[] {
  if (value === undefined || value === null) return [];
  if (typeof value === 'string') return [value];
  if (isMoneyAmount(value)) return [format(value.money)];
  return (value as readonly CurrencyTextPart[]).map((part, index) => (
    <span key={index}>{renderParts(part, format)}</span>
  ));
}
