import type {
  InvestmentPriority,
  MarketReaction,
  MonthlyCapacity,
  OtherIncomeExpectation,
  SupportedCurrency,
} from "@/types/assessment";
import { formatCompactCurrency } from "./formatting";

export type QuestionType = "number" | "slider" | "currency" | "choice";

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface QuestionDefinition {
  key: string;
  type: QuestionType;
  label: string;
  support?: string;
  options?: ChoiceOption[];
  min?: number;
  max?: number;
}

export const QUESTIONS: QuestionDefinition[] = [
  {
    key: "currentAge",
    type: "number",
    label: "How old are you?",
    min: 18,
    max: 80,
  },
  {
    key: "targetFreedomAge",
    type: "slider",
    label: "At what age would you ideally like work to become optional?",
    support:
      "This does not necessarily mean stopping work completely. Think of it as the age when your investments could comfortably support your lifestyle.",
    min: 18,
    max: 85,
  },
  {
    key: "desiredMonthlySpend",
    type: "currency",
    label: "If you stopped working today, how much would you want available to spend each month?",
  },
  {
    key: "currentInvestments",
    type: "currency",
    label: "Approximately how much do you currently have invested?",
    support:
      "Include investments intended for long-term wealth creation: stocks, mutual funds, ETFs, retirement accounts, investment portfolios, bonds and other liquid investments. Do not include your primary residence.",
  },
  {
    key: "monthlyContribution",
    type: "currency",
    label: "How much are you currently investing each month?",
    support:
      "Include recurring contributions toward your long-term investment portfolio.",
  },
  {
    key: "otherIncomeExpectation",
    type: "choice",
    label: "Do you expect meaningful income outside your investment portfolio later in life?",
    options: [
      { value: "none", label: "No — I expect my investments to fund most of my lifestyle" },
      { value: "some", label: "Yes — some income" },
      { value: "substantial", label: "Yes — substantial income" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    key: "investmentPriority",
    type: "choice",
    label: "What matters most to you?",
    options: [
      { value: "growth", label: "Growing wealth aggressively" },
      { value: "independence", label: "Building long-term financial independence" },
      { value: "preservation", label: "Preserving wealth while continuing to grow" },
      { value: "income", label: "Generating reliable income" },
      { value: "legacy", label: "Building wealth for my family and future generations" },
    ],
  },
  {
    key: "marketReaction",
    type: "choice",
    label: "If your portfolio temporarily fell 20% during a market downturn, what would you most likely do?",
    options: [
      { value: "invest_more", label: "Invest more" },
      { value: "continue", label: "Continue investing as planned" },
      { value: "reduce", label: "Reduce my contributions" },
      { value: "sell_some", label: "Sell some investments" },
      { value: "sell_most", label: "Sell most or all investments" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    key: "monthlyCapacity",
    type: "choice",
    label: "If the right investment strategy required it, what could you realistically invest each month?",
  },
];

const CAPACITY_MULTIPLIER: Record<SupportedCurrency, number> = {
  USD: 1,
  GBP: 0.8,
  AED: 3.67,
  NGN: 1500,
};

interface CapacityBracket {
  value: MonthlyCapacity;
  min: number | null;
  max: number | null;
}

const CAPACITY_BRACKETS: CapacityBracket[] = [
  { value: "under_500", min: null, max: 500 },
  { value: "500_999", min: 500, max: 999 },
  { value: "1000_2499", min: 1000, max: 2499 },
  { value: "2500_4999", min: 2500, max: 4999 },
  { value: "5000_9999", min: 5000, max: 9999 },
  { value: "10000_plus", min: 10000, max: null },
];

export function getCapacityOptions(
  currency: SupportedCurrency,
): ChoiceOption[] {
  const multiplier = CAPACITY_MULTIPLIER[currency];
  const options = CAPACITY_BRACKETS.map((bracket) => {
    if (bracket.min === null) {
      return {
        value: bracket.value,
        label: `Under ${formatCompactCurrency(bracket.max! * multiplier, currency)}`,
      };
    }
    if (bracket.max === null) {
      return {
        value: bracket.value,
        label: `${formatCompactCurrency(bracket.min * multiplier, currency)}+`,
      };
    }
    return {
      value: bracket.value,
      label: `${formatCompactCurrency(bracket.min * multiplier, currency)}–${formatCompactCurrency(bracket.max * multiplier, currency)}`,
    };
  });

  options.push({ value: "prefer_not_to_say", label: "Prefer not to say" });

  return options;
}

export function isQualified(capacity: MonthlyCapacity): boolean {
  return (
    capacity === "1000_2499" ||
    capacity === "2500_4999" ||
    capacity === "5000_9999" ||
    capacity === "10000_plus"
  );
}

export type QuestionKey =
  | "currentAge"
  | "targetFreedomAge"
  | "desiredMonthlySpend"
  | "currentInvestments"
  | "monthlyContribution"
  | "otherIncomeExpectation"
  | "investmentPriority"
  | "marketReaction"
  | "monthlyCapacity";

export type { InvestmentPriority, MarketReaction, OtherIncomeExpectation };
