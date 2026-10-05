import { formatCurrency } from "@/lib/formatting";
import type { SupportedCurrency } from "@/types/assessment";

interface FreedomNumberHeroProps {
  freedomNumber: number;
  currency: SupportedCurrency;
}

export function FreedomNumberHero({
  freedomNumber,
  currency,
}: FreedomNumberHeroProps) {
  return (
    <section className="text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
        Your Freedom Number
      </p>
      <p className="numeral mt-5 text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
        {formatCurrency(freedomNumber, currency)}
      </p>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        Based on the lifestyle and timeline you selected, this is an estimate
        of the invested capital that could support your desired spending level.
      </p>
    </section>
  );
}
