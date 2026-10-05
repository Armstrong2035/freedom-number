"use client";

import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import type { ChoiceOption } from "@/lib/questions";

interface ChoiceListProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options: ChoiceOption[];
}

export function ChoiceList({ value, onChange, options }: ChoiceListProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid gap-3"
      aria-label="Options"
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex min-h-[56px] cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-3.5 transition-colors",
              selected
                ? "border-primary bg-accent"
                : "hover:border-muted-foreground/40 hover:bg-secondary/60",
            )}
          >
            <RadioGroupItem value={option.value} />
            <span className="flex-1 text-sm font-medium leading-snug">
              {option.label}
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
