"use client";

import { cn } from "@/lib/utils";
import { CURRENCIES, CURRENCY_ORDER } from "@/lib/formatting";
import type { SupportedCurrency } from "@/types/assessment";

interface CurrencySelectProps {
  value: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
  className?: string;
}

export function CurrencySelect({
  value,
  onChange,
  className,
}: CurrencySelectProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-secondary p-1",
        className,
      )}
      role="group"
      aria-label="Currency"
    >
      {CURRENCY_ORDER.map((code) => {
        const active = value === code;
        return (
          <button
            key={code}
            type="button"
            title={CURRENCIES[code].name}
            aria-pressed={active}
            onClick={() => onChange(code)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
