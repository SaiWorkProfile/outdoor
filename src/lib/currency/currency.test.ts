/**
 * Currency system tests.
 *
 * These prove the properties the rest of the app depends on:
 *   - the registry covers the 20 supported ISO 4217 codes and nothing Intl rejects,
 *   - formatting always goes through Intl (symbol, grouping and decimal places),
 *   - a currency switch never converts, re-scales or mutates an amount,
 *   - the display preference is stored under its own key, away from project data.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENCIES,
  CURRENCY_CODES,
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  currencyOptionLabel,
  currencyOptionTitle,
  formatCurrency,
  getCurrency,
  getCurrencyName,
  getCurrencySymbol,
  isCurrencyCode,
  resolveCurrencyCode,
} from './index';
import { flattenCurrencyText, isMoneyAmount, moneyAmount, type CurrencyTextValue } from './money-value';

const digitsOnly = (value: string): string => value.replace(/[^0-9.]/g, '');

describe('currency registry', () => {
  test('exposes exactly the 20 supported ISO 4217 codes', () => {
    assert.equal(CURRENCY_CODES.length, 20);
    assert.deepEqual([...CURRENCY_CODES].sort(), [
      'AED', 'AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'DKK', 'EUR', 'GBP', 'INR',
      'JPY', 'MXN', 'NOK', 'NZD', 'PLN', 'SAR', 'SEK', 'SGD', 'USD', 'ZAR',
    ]);
    assert.equal(DEFAULT_CURRENCY, 'USD');
  });

  test('every registered code is a real ISO 4217 code that Intl accepts', () => {
    for (const code of CURRENCY_CODES) {
      const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(1);
      assert.ok(formatted.length > 0, `${code} did not format`);
      assert.equal(CURRENCIES[code].code, code);
    }
  });

  test('every currency has a distinct human name', () => {
    const names = CURRENCY_CODES.map((code) => getCurrencyName(code));
    for (const name of names) assert.ok(name && name.length > 3, `weak name: ${name}`);
    assert.equal(new Set(names).size, names.length);
  });

  test('minor units follow ISO 4217 (JPY has none, the rest have two)', () => {
    assert.equal(getCurrency('JPY').minorUnits, 0);
    for (const code of CURRENCY_CODES.filter((c) => c !== 'JPY')) {
      assert.equal(getCurrency(code).minorUnits, 2, `${code} should have two decimals`);
    }
  });
});

describe('currency code handling', () => {
  test('recognises supported codes regardless of case or surrounding space', () => {
    assert.equal(isCurrencyCode('eur'), true);
    assert.equal(isCurrencyCode('  gbp '), true);
    assert.equal(resolveCurrencyCode(' inr '), 'INR');
    assert.equal(resolveCurrencyCode('jpy'), 'JPY');
  });

  test('falls back to the default currency for anything unsupported', () => {
    assert.equal(isCurrencyCode('XYZ'), false);
    assert.equal(isCurrencyCode(undefined), false);
    assert.equal(resolveCurrencyCode('XYZ'), DEFAULT_CURRENCY);
    assert.equal(resolveCurrencyCode(''), DEFAULT_CURRENCY);
    assert.equal(resolveCurrencyCode(null), DEFAULT_CURRENCY);
    assert.equal(getCurrency('nope').code, DEFAULT_CURRENCY);
    assert.equal(getCurrencyName(undefined), 'United States dollar');
  });

  test('symbols come from Intl so they cannot drift from the formatter', () => {
    assert.equal(getCurrencySymbol('USD'), '$');
    assert.equal(getCurrencySymbol('GBP'), '£');
    assert.equal(getCurrencySymbol('INR'), '₹');
    assert.equal(getCurrencySymbol('JPY'), '¥');
    /* A bare "$" would be ambiguous between USD, CAD, AUD and MXN. */
    assert.equal(getCurrencySymbol('CAD'), 'CA$');
    assert.equal(getCurrencySymbol('MXN'), 'MX$');
    assert.equal(getCurrencySymbol('GBP'), getCurrencySymbol('gbp'));
    assert.equal(getCurrencySymbol('unknown'), getCurrencySymbol(DEFAULT_CURRENCY));
  });
});


describe('formatting', () => {
  test('formats the default currency with grouping and two decimals', () => {
    assert.equal(formatCurrency(1234.5), '$1,234.50');
    assert.equal(formatCurrency(1234.5, 'USD'), '$1,234.50');
    assert.equal(formatCurrency(0), '$0.00');
    assert.equal(formatCurrency(2724.25), '$2,724.25');
  });

  test('a currency switch changes the symbol only, never the amount', () => {
    const amount = 2724.25;
    const usd = formatCurrency(amount, 'USD');
    const eur = formatCurrency(amount, 'EUR');
    const inr = formatCurrency(amount, 'INR');
    assert.equal(usd, '$2,724.25');
    assert.equal(eur, '€2,724.25');
    assert.equal(inr, '₹2,724.25');
    assert.equal(digitsOnly(usd), digitsOnly(eur));
    assert.equal(digitsOnly(eur), digitsOnly(inr));
    assert.equal(amount, 2724.25, 'formatting must not touch the caller value');
  });

  test('decimal places follow the currency minor units', () => {
    /* Yen has no minor unit, so a computed total is written in whole yen. */
    assert.equal(formatCurrency(2724.25, 'JPY'), '¥2,724');
    assert.equal(formatCurrency(2724.25, 'USD'), '$2,724.25');
  });

  test('the digits option echoes exactly what a visitor typed', () => {
    assert.equal(formatCurrency(45, 'GBP', { digits: 0 }), '£45');
    assert.equal(formatCurrency(45.5, 'JPY', { digits: 1 }), '¥45.5');
    assert.equal(formatCurrency(2.1, 'USD', { digits: 2 }), '$2.10');
  });

  test('handles zero, negatives and non-finite input', () => {
    assert.equal(formatCurrency(0, 'EUR'), '€0.00');
    assert.equal(formatCurrency(-45, 'USD'), '-$45.00');
    assert.equal(formatCurrency(Number.NaN, 'USD'), '—');
    assert.equal(formatCurrency(Number.POSITIVE_INFINITY, 'EUR'), '—');
  });

  test('selector labels are compact and the tooltip names the currency', () => {
    assert.equal(currencyOptionLabel('USD'), 'USD $');
    assert.equal(currencyOptionLabel('JPY'), 'JPY ¥');
    assert.equal(currencyOptionLabel('SEK'), 'SEK');
    assert.equal(currencyOptionTitle('EUR'), 'EUR — Euro (€)');
    assert.equal(currencyOptionLabel('unknown'), 'USD $');
  });
});

describe('structured money values', () => {
  test('wraps and detects money parts', () => {
    const part = moneyAmount(1234.5);
    assert.deepEqual(part, { money: 1234.5 });
    assert.equal(isMoneyAmount(part), true);
    assert.equal(isMoneyAmount('1234.5'), false);
    assert.equal(isMoneyAmount({ amount: 1 }), false);
  });

  test('flattens nested text and money parts in the requested currency', () => {
    const value: CurrencyTextValue = [
      moneyAmount(45),
      ' × 3 plus ',
      [moneyAmount(12.5), ' delivery'],
    ];
    assert.equal(flattenCurrencyText(value), '$45.00 × 3 plus $12.50 delivery');
    assert.equal(flattenCurrencyText(value, 'EUR'), '€45.00 × 3 plus €12.50 delivery');
    assert.equal(flattenCurrencyText('plain text'), 'plain text');
    assert.equal(flattenCurrencyText(undefined), '');
  });

  test('the display preference is stored separately from project data', () => {
    assert.equal(CURRENCY_STORAGE_KEY, 'measure-to-build-currency');
    assert.notEqual(CURRENCY_STORAGE_KEY, 'outdoor-project-v1');
  });
});
