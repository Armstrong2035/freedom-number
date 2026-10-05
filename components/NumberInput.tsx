"use client";

import * as React from "react";
import { Input } from "./ui/input";

interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  autoFocus?: boolean;
  inputMode?: "numeric" | "decimal";
  ariaLabel?: string;
  className?: string;
}

function sanitize(raw: string, allowDecimal: boolean): string {
  let cleaned = raw.replace(/[^\d.]/g, "");
  if (allowDecimal) {
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1) {
      cleaned =
        cleaned.slice(0, firstDot + 1) +
        cleaned.slice(firstDot + 1).replace(/\./g, "");
    }
  } else {
    cleaned = cleaned.replace(/\./g, "");
  }
  return cleaned;
}

export function NumberInput({
  value,
  onChange,
  placeholder,
  autoFocus,
  inputMode = "decimal",
  ariaLabel,
  className,
}: NumberInputProps) {
  const [raw, setRaw] = React.useState(
    value === undefined ? "" : String(value),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitize(event.target.value, inputMode === "decimal");
    setRaw(cleaned);
    if (cleaned === "") {
      onChange(undefined);
      return;
    }
    const parsed = Number(cleaned);
    onChange(Number.isFinite(parsed) ? parsed : undefined);
  };

  return (
    <Input
      type="text"
      inputMode={inputMode}
      autoComplete="off"
      value={raw}
      onChange={handleChange}
      placeholder={placeholder ?? "0"}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      className={className}
    />
  );
}
