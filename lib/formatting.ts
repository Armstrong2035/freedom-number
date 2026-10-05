import type { SupportedCurrency } from "@/types/assessment";

export interface CurrencyMeta {
  code: SupportedCurrency;
  name: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyMeta> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US" },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB" },
  NGN: { code: "NGN", name: "Nigerian Naira", symbol: "₦", locale: "en-NG" },
  AED: { code: "AED", name: "UAE Dirham", symbol: "AED", locale: "en-AE" },
};

export const CURRENCY_ORDER: SupportedCurrency[] = ["USD", "GBP", "NGN", "AED"];

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  maximumFractionDigits = 0,
): string {
  const meta = CURRENCIES[currency];
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.code,
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(
  amount: number,
  currency: SupportedCurrency,
  maximumFractionDigits = 1,
): string {
  const meta = CURRENCIES[currency];
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.code,
    notation: "compact",
    maximumFractionDigits,
  }).format(amount);
}

export function formatPercent(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("en", {
    style: "percent",
    maximumFractionDigits,
  }).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits,
  }).format(value);
}

export function roundContribution(value: number): number {
  if (value <= 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const step = magnitude / 10;
  return Math.max(step, Math.round(value / step) * step);
}

export function currencySymbol(currency: SupportedCurrency): string {
  return CURRENCIES[currency].symbol;
}
