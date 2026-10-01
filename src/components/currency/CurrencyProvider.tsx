'use client';

/**
 * Currency display preference for the whole app.
 *
 * The provider is mounted once in the root layout, so every calculator page,
 * Project Mode view and the printable plan read the same currency. The stored
 * preference is read *after* mount: the first render always matches the
 * server-rendered HTML (the default currency), which keeps hydration
 * deterministic while still restoring the visitor's choice immediately.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  formatCurrency,
  getCurrency,
  getCurrencySymbol,
  resolveCurrencyCode,
  type CurrencyCode,
  type CurrencyDefinition,
} from '@/lib/currency';

export interface CurrencyContextValue {
  /** Selected ISO 4217 code. */
  code: CurrencyCode;
  currency: CurrencyDefinition;
  symbol: string;
  /** Format an amount in the selected currency. Never converts the amount. */
  format: (value: number, digits?: number) => string;
  selectCurrency: (code: string) => void;
  /** True while the "review your price inputs" reminder is relevant. */
  changed: boolean;
  acknowledgeChange: () => void;
}

const FALLBACK: CurrencyContextValue = {
  code: DEFAULT_CURRENCY,
  currency: getCurrency(DEFAULT_CURRENCY),
  symbol: getCurrencySymbol(DEFAULT_CURRENCY),
  format: (value: number, digits?: number) => formatCurrency(value, DEFAULT_CURRENCY, { digits }),
  selectCurrency: () => {},
  changed: false,
  acknowledgeChange: () => {},
};

const CurrencyContext = createContext<CurrencyContextValue>(FALLBACK);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (stored) setCode(resolveCurrencyCode(stored));
    } catch {
      /* storage unavailable (private mode, blocked cookies): keep the default */
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CURRENCY_STORAGE_KEY) return;
      setCode(resolveCurrencyCode(event.newValue));
      setChanged(true);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const selectCurrency = useCallback((next: string) => {
    const resolved = resolveCurrencyCode(next);
    setCode(resolved);
    setChanged(true);
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, resolved);
    } catch {
      /* the choice still applies for this page view */
    }
  }, []);

  const acknowledgeChange = useCallback(() => setChanged(false), []);

  const value = useMemo<CurrencyContextValue>(() => ({
    code,
    currency: getCurrency(code),
    symbol: getCurrencySymbol(code),
    format: (amount: number, digits?: number) => formatCurrency(amount, code, { digits }),
    selectCurrency,
    changed,
    acknowledgeChange,
  }), [code, changed, selectCurrency, acknowledgeChange]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

/**
 * Read the current display currency. Safe to call outside the provider (returns the
 * default currency), so a component can never crash on a page that skips the provider.
 */
export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
