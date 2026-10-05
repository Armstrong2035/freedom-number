"use client";

import * as React from "react";
import { Input } from "./ui/input";
import { currencySymbol } from "@/lib/formatting";
import type { SupportedCurrency } from "@/types/assessment";

interface CurrencyInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  currency: SupportedCurrency;
  placeholder?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
  className?: string;
}

function sanitize(raw: string): string {
  let cleaned = raw.replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }
  return cleaned;
}

export function CurrencyInput({
  value,
  onChange,
  currency,
  placeholder,
  autoFocus,
  ariaLabel,
  className,
}: CurrencyInputProps) {
  const [raw, setRaw] = React.useState(
    value === undefined ? "" : String(value),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitize(event.target.value);
    setRaw(cleaned);
    if (cleaned === "") {
      onChange(undefined);
      return;
    }
    const parsed = Number(cleaned);
    onChange(Number.isFinite(parsed) ? parsed : undefined);
  };

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground"
      >
        {currencySymbol(currency)}
      </span>
      <Input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={raw}
        onChange={handleChange}
        placeholder={placeholder ?? "0"}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={className}
      />
    </div>
  );
}
