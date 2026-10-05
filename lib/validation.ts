import { z } from "zod";
import {
  MAX_AGE,
  MAX_TARGET_AGE,
  MIN_AGE,
} from "./constants";
import type { AssessmentInput, SupportedCurrency } from "@/types/assessment";

export const currencySchema = z.enum(["USD", "GBP", "NGN", "AED"]);

export const currentAgeSchema = z.coerce
  .number({ message: "Enter your age." })
  .int("Enter a whole number.")
  .min(MIN_AGE, `You must be at least ${MIN_AGE}.`)
  .max(MAX_AGE, `You must be ${MAX_AGE} or younger.`);

export const targetFreedomAgeSchema = (currentAge: number) =>
  z.coerce
    .number({ message: "Enter an age." })
    .int("Enter a whole number.")
    .min(currentAge + 1, "This must be greater than your current age.")
    .max(MAX_TARGET_AGE, `This must be ${MAX_TARGET_AGE} or younger.`);

export const desiredMonthlySpendSchema = z.coerce
  .number({ message: "Enter an amount." })
  .min(0, "Enter an amount of zero or more.")
  .max(1_000_000_000, "Enter a smaller amount.");

export const currentInvestmentsSchema = z.coerce
  .number({ message: "Enter an amount." })
  .min(0, "Enter an amount of zero or more.")
  .max(1_000_000_000_000, "Enter a smaller amount.");

export const monthlyContributionSchema = z.coerce
  .number({ message: "Enter an amount." })
  .min(0, "Enter an amount of zero or more.")
  .max(1_000_000_000, "Enter a smaller amount.");

export const otherIncomeExpectationSchema = z.enum([
  "none",
  "some",
  "substantial",
  "unsure",
]);

export const investmentPrioritySchema = z.enum([
  "growth",
  "independence",
  "preservation",
  "income",
  "legacy",
]);

export const marketReactionSchema = z.enum([
  "invest_more",
  "continue",
  "reduce",
  "sell_some",
  "sell_most",
  "unsure",
]);

export const monthlyCapacitySchema = z.enum([
  "under_500",
  "500_999",
  "1000_2499",
  "2500_4999",
  "5000_9999",
  "10000_plus",
  "prefer_not_to_say",
]);

const CHOICE_KEYS = new Set([
  "otherIncomeExpectation",
  "investmentPriority",
  "marketReaction",
  "monthlyCapacity",
]);

export function validateField(
  key: string,
  value: unknown,
  answers: Partial<AssessmentInput>,
): string | null {
  if ((value === undefined || value === "") && CHOICE_KEYS.has(key)) {
    return "Select an option.";
  }

  let result: { success: boolean; error?: { issues: { message?: string }[] } };

  switch (key) {
    case "currentAge":
      result = currentAgeSchema.safeParse(value);
      break;
    case "targetFreedomAge":
      result = targetFreedomAgeSchema(
        answers.currentAge ?? MIN_AGE,
      ).safeParse(value);
      break;
    case "desiredMonthlySpend":
      result = desiredMonthlySpendSchema.safeParse(value);
      break;
    case "currentInvestments":
      result = currentInvestmentsSchema.safeParse(value);
      break;
    case "monthlyContribution":
      result = monthlyContributionSchema.safeParse(value);
      break;
    case "otherIncomeExpectation":
      result = otherIncomeExpectationSchema.safeParse(value);
      break;
    case "investmentPriority":
      result = investmentPrioritySchema.safeParse(value);
      break;
    case "marketReaction":
      result = marketReactionSchema.safeParse(value);
      break;
    case "monthlyCapacity":
      result = monthlyCapacitySchema.safeParse(value);
      break;
    default:
      return "This question is not valid.";
  }

  if (result.success) return null;
  return result.error?.issues?.[0]?.message ?? "Enter a valid value.";
}

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim(),
  country: z.string().trim(),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "You must agree to receive communications.",
    }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type Currency = SupportedCurrency;
