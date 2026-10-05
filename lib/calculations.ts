import {
  DEFAULT_ANNUAL_RETURN,
  DEFAULT_INFLATION,
  DEFAULT_WITHDRAWAL_RATE,
} from "./constants";
import type {
  AssessmentInput,
  FreedomNumberResult,
  ProjectionPoint,
} from "@/types/assessment";

export interface CalculationAssumptions {
  annualReturn: number;
  inflation: number;
  withdrawalRate: number;
}

export const DEFAULT_ASSUMPTIONS: CalculationAssumptions = {
  annualReturn: DEFAULT_ANNUAL_RETURN,
  inflation: DEFAULT_INFLATION,
  withdrawalRate: DEFAULT_WITHDRAWAL_RATE,
};

export function calculateYearsRemaining(
  currentAge: number,
  targetFreedomAge: number,
): number {
  return Math.max(0, targetFreedomAge - currentAge);
}

export function calculateFreedomNumber(
  desiredMonthlySpend: number,
  withdrawalRate: number = DEFAULT_WITHDRAWAL_RATE,
): number {
  if (withdrawalRate <= 0) return 0;
  return (desiredMonthlySpend * 12) / withdrawalRate;
}

export function calculateFutureValueOfPrincipal(
  principal: number,
  annualReturn: number,
  yearsRemaining: number,
): number {
  return principal * Math.pow(1 + annualReturn, yearsRemaining);
}

export function calculateFutureValueOfContributions(
  monthlyContribution: number,
  annualReturn: number,
  yearsRemaining: number,
): number {
  const monthlyReturn = annualReturn / 12;
  const monthsRemaining = yearsRemaining * 12;

  if (monthlyReturn === 0) {
    return monthlyContribution * monthsRemaining;
  }

  return (
    monthlyContribution *
    ((Math.pow(1 + monthlyReturn, monthsRemaining) - 1) / monthlyReturn)
  );
}

export function calculateProjectedPortfolio(
  futureValueCurrentAssets: number,
  futureValueContributions: number,
): number {
  return futureValueCurrentAssets + futureValueContributions;
}

export function calculateFreedomGap(
  freedomNumber: number,
  projectedPortfolio: number,
): number {
  return freedomNumber - projectedPortfolio;
}

export function calculateRequiredMonthlyContribution(
  freedomNumber: number,
  futureValueCurrentAssets: number,
  annualReturn: number,
  yearsRemaining: number,
): number {
  const requiredFromContributions = freedomNumber - futureValueCurrentAssets;

  if (requiredFromContributions <= 0) {
    return 0;
  }

  const monthlyReturn = annualReturn / 12;
  const monthsRemaining = yearsRemaining * 12;

  if (monthlyReturn === 0) {
    return monthsRemaining > 0 ? requiredFromContributions / monthsRemaining : 0;
  }

  const annuityFactor =
    (Math.pow(1 + monthlyReturn, monthsRemaining) - 1) / monthlyReturn;

  if (annuityFactor === 0) {
    return 0;
  }

  return requiredFromContributions / annuityFactor;
}

export function calculateProgressPercentage(
  projectedPortfolio: number,
  freedomNumber: number,
): number {
  if (freedomNumber <= 0) return 0;
  return Math.min(100, (projectedPortfolio / freedomNumber) * 100);
}

export function buildProjectionSeries(
  input: AssessmentInput,
  assumptions: CalculationAssumptions = DEFAULT_ASSUMPTIONS,
): ProjectionPoint[] {
  const { annualReturn } = assumptions;
  const points: ProjectionPoint[] = [];

  for (let age = input.currentAge; age <= input.targetFreedomAge; age++) {
    const years = calculateYearsRemaining(input.currentAge, age);
    const principal = calculateFutureValueOfPrincipal(
      input.currentInvestments,
      annualReturn,
      years,
    );
    const contributions = calculateFutureValueOfContributions(
      input.monthlyContribution,
      annualReturn,
      years,
    );
    points.push({ age, portfolio: principal + contributions });
  }

  return points;
}

export function calculateFreedomNumberResult(
  input: AssessmentInput,
  assumptions: CalculationAssumptions = DEFAULT_ASSUMPTIONS,
): FreedomNumberResult {
  const yearsRemaining = calculateYearsRemaining(
    input.currentAge,
    input.targetFreedomAge,
  );

  const freedomNumber = calculateFreedomNumber(
    input.desiredMonthlySpend,
    assumptions.withdrawalRate,
  );

  const futureValueCurrentAssets = calculateFutureValueOfPrincipal(
    input.currentInvestments,
    assumptions.annualReturn,
    yearsRemaining,
  );

  const futureValueContributions = calculateFutureValueOfContributions(
    input.monthlyContribution,
    assumptions.annualReturn,
    yearsRemaining,
  );

  const projectedPortfolio = calculateProjectedPortfolio(
    futureValueCurrentAssets,
    futureValueContributions,
  );

  const freedomGap = calculateFreedomGap(freedomNumber, projectedPortfolio);

  const requiredMonthlyContribution = calculateRequiredMonthlyContribution(
    freedomNumber,
    futureValueCurrentAssets,
    assumptions.annualReturn,
    yearsRemaining,
  );

  const progressPercentage = calculateProgressPercentage(
    projectedPortfolio,
    freedomNumber,
  );

  return {
    freedomNumber,
    yearsRemaining,
    futureValueCurrentAssets,
    futureValueContributions,
    projectedPortfolio,
    freedomGap,
    requiredMonthlyContribution,
    progressPercentage,
  };
}
