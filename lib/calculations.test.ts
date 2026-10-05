import { describe, expect, it } from "vitest";
import {
  calculateFreedomGap,
  calculateFreedomNumber,
  calculateFreedomNumberResult,
  calculateFutureValueOfContributions,
  calculateFutureValueOfPrincipal,
  calculateProgressPercentage,
  calculateRequiredMonthlyContribution,
  calculateYearsRemaining,
  DEFAULT_ASSUMPTIONS,
} from "./calculations";
import type { AssessmentInput } from "@/types/assessment";

describe("calculateFreedomNumber", () => {
  it("computes $2.4M for $8,000/month at a 4% withdrawal rate", () => {
    expect(calculateFreedomNumber(8000, 0.04)).toBe(2400000);
  });

  it("computes $3M for $10,000/month", () => {
    expect(calculateFreedomNumber(10000, 0.04)).toBe(3000000);
  });

  it("returns zero when the withdrawal rate is zero", () => {
    expect(calculateFreedomNumber(8000, 0)).toBe(0);
  });
});

describe("calculateYearsRemaining", () => {
  it("subtracts current age from target age", () => {
    expect(calculateYearsRemaining(35, 55)).toBe(20);
  });

  it("floors negative values at zero", () => {
    expect(calculateYearsRemaining(60, 55)).toBe(0);
  });
});

describe("future value", () => {
  it("grows the principal", () => {
    expect(calculateFutureValueOfPrincipal(100000, 0.07, 20)).toBeCloseTo(
      386968.446,
      1,
    );
  });

  it("computes the contribution annuity", () => {
    expect(calculateFutureValueOfContributions(1500, 0.07, 20)).toBeCloseTo(
      781389.99,
      1,
    );
  });

  it("uses a simple sum when the return is zero", () => {
    expect(calculateFutureValueOfContributions(1000, 0, 10)).toBeCloseTo(
      120000,
      5,
    );
  });
});

describe("gap and progress", () => {
  it("computes the freedom gap", () => {
    expect(calculateFreedomGap(2400000, 1168358.436)).toBeCloseTo(
      1231641.564,
      1,
    );
  });

  it("caps progress at 100%", () => {
    expect(calculateProgressPercentage(3000000, 2400000)).toBe(100);
  });

  it("computes progress as a percentage", () => {
    expect(calculateProgressPercentage(1200000, 2400000)).toBeCloseTo(50, 5);
  });
});

describe("required monthly contribution", () => {
  it("returns zero when current assets already cover the target", () => {
    expect(calculateRequiredMonthlyContribution(2400000, 3000000, 0.07, 20)).toBe(
      0,
    );
  });

  it("solves the annuity formula backwards", () => {
    expect(
      calculateRequiredMonthlyContribution(2400000, 386968.446, 0.07, 20),
    ).toBeCloseTo(3864.328, 1);
  });
});

const sampleInput: AssessmentInput = {
  currentAge: 35,
  targetFreedomAge: 55,
  currency: "USD",
  desiredMonthlySpend: 8000,
  currentInvestments: 100000,
  monthlyContribution: 1500,
  otherIncomeExpectation: "none",
  investmentPriority: "independence",
  marketReaction: "continue",
  monthlyCapacity: "1000_2499",
};

describe("calculateFreedomNumberResult", () => {
  const result = calculateFreedomNumberResult(sampleInput);

  it("uses the default assumptions", () => {
    expect(DEFAULT_ASSUMPTIONS.annualReturn).toBe(0.07);
    expect(DEFAULT_ASSUMPTIONS.withdrawalRate).toBe(0.04);
  });

  it("computes the freedom number", () => {
    expect(result.freedomNumber).toBe(2400000);
  });

  it("computes the years remaining", () => {
    expect(result.yearsRemaining).toBe(20);
  });

  it("computes the projected portfolio", () => {
    expect(result.projectedPortfolio).toBeCloseTo(1168358.436, 1);
  });

  it("computes a positive gap", () => {
    expect(result.freedomGap).toBeCloseTo(1231641.564, 1);
  });

  it("computes the required monthly contribution", () => {
    expect(result.requiredMonthlyContribution).toBeCloseTo(3864.328, 1);
  });

  it("computes the progress percentage", () => {
    expect(result.progressPercentage).toBeCloseTo(48.68, 1);
  });
});

describe("zero-gap scenarios", () => {
  it("requires no extra contribution when assets exceed the target", () => {
    const input: AssessmentInput = {
      ...sampleInput,
      currentInvestments: 4000000,
      monthlyContribution: 0,
    };
    const result = calculateFreedomNumberResult(input);
    expect(result.requiredMonthlyContribution).toBe(0);
    expect(result.freedomGap).toBeLessThan(0);
    expect(result.progressPercentage).toBe(100);
  });
});
