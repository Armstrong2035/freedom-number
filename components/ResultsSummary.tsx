import { formatCompactCurrency, formatCurrency } from "@/lib/formatting";
import type {
  AssessmentInput,
  FreedomNumberResult,
} from "@/types/assessment";

interface ResultsSummaryProps {
  input: AssessmentInput;
  result: FreedomNumberResult;
}

export function ResultsSummary({ input, result }: ResultsSummaryProps) {
  const cards = [
    { label: "Target Freedom Age", value: `${input.targetFreedomAge}` },
    {
      label: "Desired Lifestyle",
      value: `${formatCurrency(input.desiredMonthlySpend, input.currency)}/mo`,
    },
    {
      label: "Freedom Number",
      value: formatCompactCurrency(result.freedomNumber, input.currency),
    },
    {
      label: "Projected Portfolio",
      value: formatCompactCurrency(result.projectedPortfolio, input.currency),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {card.label}
          </p>
          <p className="numeral mt-2 text-lg font-semibold tracking-tight md:text-xl">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
