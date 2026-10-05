export type SupportedCurrency = "USD" | "GBP" | "NGN" | "AED";

export type OtherIncomeExpectation = "none" | "some" | "substantial" | "unsure";

export type InvestmentPriority =
  | "growth"
  | "independence"
  | "preservation"
  | "income"
  | "legacy";

export type MarketReaction =
  | "invest_more"
  | "continue"
  | "reduce"
  | "sell_some"
  | "sell_most"
  | "unsure";

export type MonthlyCapacity =
  | "under_500"
  | "500_999"
  | "1000_2499"
  | "2500_4999"
  | "5000_9999"
  | "10000_plus"
  | "prefer_not_to_say";

export interface AssessmentInput {
  currentAge: number;
  targetFreedomAge: number;
  currency: SupportedCurrency;
  desiredMonthlySpend: number;
  currentInvestments: number;
  monthlyContribution: number;
  otherIncomeExpectation: OtherIncomeExpectation;
  investmentPriority: InvestmentPriority;
  marketReaction: MarketReaction;
  monthlyCapacity: MonthlyCapacity;
}

export interface FreedomNumberResult {
  freedomNumber: number;
  yearsRemaining: number;
  futureValueCurrentAssets: number;
  futureValueContributions: number;
  projectedPortfolio: number;
  freedomGap: number;
  requiredMonthlyContribution: number;
  progressPercentage: number;
}

export interface ProjectionPoint {
  age: number;
  portfolio: number;
}

export interface StoredResult {
  id: string;
  input: AssessmentInput;
  result: FreedomNumberResult;
  createdAt: string;
}
