/**
 * Structured money values for content and other data modules.
 *
 * Content pages are data, not markup: a worked example lists a cost as a number
 * plus a label rather than a pre-formatted string. Keeping the amount as a number
 * lets the renderer format it in whichever currency the visitor selected, and it
 * removes the last place where a hardcoded "$" could hide inside content copy.
 *
 * A `CurrencyTextValue` is therefore either plain text or a nested list of text
 * and money amounts. `flattenCurrencyText` turns one back into a single string for
 * tooling (QA audits, word counts) and for non-React consumers.
 */
import { DEFAULT_CURRENCY, formatCurrency } from './index';

/** A money amount. Deliberately tiny so it stays serialisable content data. */
export interface MoneyAmount {
  readonly money: number;
}

export type CurrencyTextPart = string | MoneyAmount | readonly CurrencyTextPart[];

export type CurrencyTextValue = string | MoneyAmount | readonly CurrencyTextPart[];

export function moneyAmount(value: number): MoneyAmount {
  return { money: value };
}

export function isMoneyAmount(value: unknown): value is MoneyAmount {
  return Boolean(value) && typeof value === 'object' && typeof (value as MoneyAmount).money === 'number';
}

/**
 * Collapse structured text into a plain string. Money parts are rendered with the
 * currency the caller passes (default: the platform default currency).
 */
export function flattenCurrencyText(value: CurrencyTextValue | undefined | null, code: string = DEFAULT_CURRENCY): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (isMoneyAmount(value)) return formatCurrency(value.money, code);
  return (value as readonly CurrencyTextPart[]).map((part) => flattenCurrencyText(part, code)).join('');
}
