/**
 * Central currency registry, formatter and display helpers.
 *
 * Why this module exists
 * ----------------------
 * Every price a visitor enters or reads is money, so currency is handled in one
 * place instead of being hardcoded as "$" inside calculator results, Project Mode
 * and the printable plan. The registry is keyed by ISO 4217 code and all output
 * goes through `Intl.NumberFormat`, so supporting another currency means adding
 * one registry entry — never editing a component.
 *
 * Two rules the rest of the app relies on:
 *  1. Switching currency is a *display* change. Amounts are never converted and
 *     never re-derived; the number the visitor typed stays the number the engine
 *     calculated.
 *  2. The visitor's display preference is persisted under its own key and is
 *     independent of the project data (`src/lib/project-mode` stores its own
 *     `currencyCode`), so the two can never overwrite each other.
 */

/** Where the visitor's display preference lives. Deliberately separate from project storage. */
export const CURRENCY_STORAGE_KEY = 'measure-to-build-currency';

/** Used before the visitor chooses, and whenever a stored value is not a supported code. */
export const DEFAULT_CURRENCY = 'USD' as const;

/**
 * Locale used for grouping and decimal separators. It is pinned so the same amount
 * always reads the same way across results, tables and the printed plan, while the
 * currency unit (symbol, code and decimal places) comes from the ISO 4217 registry.
 */
export const CURRENCY_DISPLAY_LOCALE = 'en-US';

/** Every currency this platform can display, in the order the selector lists them. */
export const CURRENCY_CODES = [
  'USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'SGD', 'AED', 'SAR',
  'ZAR', 'JPY', 'CNY', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'BRL', 'MXN',
] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export interface CurrencyDefinition {
  code: CurrencyCode;
  name: string;
  /** Minor units per ISO 4217: 2 for most currencies, 0 where there is no fractional unit. */
  minorUnits: number;
}

/** ISO 4217 registry. `minorUnits` drives the default decimals, not the stored value. */
export const CURRENCIES: Record<CurrencyCode, CurrencyDefinition> = {
  USD: { code: 'USD', name: 'United States dollar', minorUnits: 2 },
  INR: { code: 'INR', name: 'Indian rupee', minorUnits: 2 },
  EUR: { code: 'EUR', name: 'Euro', minorUnits: 2 },
  GBP: { code: 'GBP', name: 'Pound sterling', minorUnits: 2 },
  CAD: { code: 'CAD', name: 'Canadian dollar', minorUnits: 2 },
  AUD: { code: 'AUD', name: 'Australian dollar', minorUnits: 2 },
  NZD: { code: 'NZD', name: 'New Zealand dollar', minorUnits: 2 },
  SGD: { code: 'SGD', name: 'Singapore dollar', minorUnits: 2 },
  AED: { code: 'AED', name: 'United Arab Emirates dirham', minorUnits: 2 },
  SAR: { code: 'SAR', name: 'Saudi riyal', minorUnits: 2 },
  ZAR: { code: 'ZAR', name: 'South African rand', minorUnits: 2 },
  JPY: { code: 'JPY', name: 'Japanese yen', minorUnits: 0 },
  CNY: { code: 'CNY', name: 'Chinese yuan', minorUnits: 2 },
  CHF: { code: 'CHF', name: 'Swiss franc', minorUnits: 2 },
  SEK: { code: 'SEK', name: 'Swedish krona', minorUnits: 2 },
  NOK: { code: 'NOK', name: 'Norwegian krone', minorUnits: 2 },
  DKK: { code: 'DKK', name: 'Danish krone', minorUnits: 2 },
  PLN: { code: 'PLN', name: 'Polish złoty', minorUnits: 2 },
  BRL: { code: 'BRL', name: 'Brazilian real', minorUnits: 2 },
  MXN: { code: 'MXN', name: 'Mexican peso', minorUnits: 2 },
};


/** True when the value is one of the supported ISO codes (case-insensitive, trimmed). */
export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && (CURRENCY_CODES as readonly string[]).includes(value.trim().toUpperCase());
}

/** Any input — stored value, unknown string, null — resolved to a supported code. */
export function resolveCurrencyCode(value?: string | null): CurrencyCode {
  const candidate = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return (CURRENCY_CODES as readonly string[]).includes(candidate) ? (candidate as CurrencyCode) : DEFAULT_CURRENCY;
}

export function getCurrency(code?: string | null): CurrencyDefinition {
  return CURRENCIES[resolveCurrencyCode(code)];
}

export function getCurrencyName(code?: string | null): string {
  return getCurrency(code).name;
}

const symbolCache = new Map<CurrencyCode, string>();

/**
 * Currency symbol taken from `Intl` itself, so it can never drift from the
 * formatter (for example "CA$" for CAD instead of a bare "$").
 */
export function getCurrencySymbol(code?: string | null): string {
  const resolved = resolveCurrencyCode(code);
  const cached = symbolCache.get(resolved);
  if (cached) return cached;
  const part = new Intl.NumberFormat(CURRENCY_DISPLAY_LOCALE, {
    style: 'currency',
    currency: resolved,
    currencyDisplay: 'symbol',
  }).formatToParts(0).find((entry) => entry.type === 'currency');
  const symbol = part?.value ?? resolved;
  symbolCache.set(resolved, symbol);
  return symbol;
}

export interface CurrencyFormatOptions {
  /** Override the registry's decimal places (e.g. echo exactly what a visitor typed). */
  digits?: number;
}

/**
 * Format an amount for display. The value is used exactly as supplied — this
 * function never converts between currencies, which is what makes a currency
 * switch a display-only change.
 */
export function formatCurrency(value: number, code?: string | null, options: CurrencyFormatOptions = {}): string {
  if (!Number.isFinite(value)) return '—';
  const currency = getCurrency(code);
  const digits = options.digits ?? currency.minorUnits;
  return new Intl.NumberFormat(CURRENCY_DISPLAY_LOCALE, {
    style: 'currency',
    currency: currency.code,
    currencyDisplay: 'symbol',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Compact label for the selector, e.g. "USD $", "SEK", "JPY ¥". */
export function currencyOptionLabel(code?: string | null): string {
  const currency = getCurrency(code);
  const symbol = getCurrencySymbol(currency.code);
  return symbol === currency.code ? currency.code : `${currency.code} ${symbol}`;
}

/** Tooltip / screen-reader text for a currency option. */
export function currencyOptionTitle(code?: string | null): string {
  const currency = getCurrency(code);
  return `${currency.code} — ${currency.name} (${getCurrencySymbol(currency.code)})`;
}
