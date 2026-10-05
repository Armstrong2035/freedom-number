"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, getCapacityOptions } from "@/lib/questions";
import { validateField } from "@/lib/validation";
import { calculateFreedomNumberResult } from "@/lib/calculations";
import { useMounted } from "@/lib/use-mounted";
import { track } from "@/lib/analytics";
import {
  clearDraft,
  generateId,
  loadDraft,
  saveDraft,
  saveResult,
} from "@/lib/storage";
import {
  MAX_TARGET_AGE,
  MIN_AGE,
} from "@/lib/constants";
import type { AssessmentInput } from "@/types/assessment";
import { SiteHeader } from "@/components/SiteHeader";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { QuestionCard } from "@/components/QuestionCard";
import { NumberInput } from "@/components/NumberInput";
import { CurrencyInput } from "@/components/CurrencyInput";
import { CurrencySelect } from "@/components/CurrencySelect";
import { ChoiceList } from "@/components/ChoiceList";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function AssessmentWizard() {
  const router = useRouter();
  const mounted = useMounted();
  const [step, setStep] = React.useState(() => {
    if (typeof window === "undefined") return 0;
    return loadDraft()?.step ?? 0;
  });
  const [answers, setAnswers] = React.useState<Partial<AssessmentInput>>(() => {
    if (typeof window === "undefined") return { currency: "USD" };
    const draft = loadDraft();
    return draft ? { currency: "USD", ...draft.answers } : { currency: "USD" };
  });
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    track("assessment_started");
  }, []);

  React.useEffect(() => {
    saveDraft({ step, answers });
  }, [step, answers]);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const currentValue = answers[question.key as keyof AssessmentInput];

  function updateAnswer(key: keyof AssessmentInput, value: unknown) {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "currentAge") {
        const age = Number(value) || MIN_AGE;
        const defaultTarget = Math.min(age + 20, MAX_TARGET_AGE);
        if (
          next.targetFreedomAge === undefined ||
          next.targetFreedomAge <= age
        ) {
          next.targetFreedomAge = defaultTarget;
        }
      }
      return next;
    });
    setError(null);
  }

  function handleNext() {
    const validationError = validateField(question.key, currentValue, answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    track("question_completed", {
      question: question.key,
      step: step + 1,
    });

    if (isLast) {
      finish();
      return;
    }

    setStep((current) => current + 1);
  }

  function handleBack() {
    setError(null);
    setStep((current) => Math.max(0, current - 1));
  }

  function finish() {
    const input = answers as AssessmentInput;
    const result = calculateFreedomNumberResult(input);
    const id = generateId();
    saveResult({
      id,
      input,
      result,
      createdAt: new Date().toISOString(),
    });
    clearDraft();
    track("assessment_completed", { id });
    router.push(`/results/${id}`);
  }

  function renderInput() {
    switch (question.type) {
      case "number":
        return (
          <NumberInput
            value={currentValue as number | undefined}
            onChange={(value) => updateAnswer("currentAge", value)}
            inputMode="numeric"
            autoFocus
            ariaLabel={question.label}
            placeholder="0"
            className="numeral h-16 border-0 border-b-2 border-input bg-transparent px-0 text-center text-4xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 md:text-5xl"
          />
        );

      case "slider": {
        const currentAge = answers.currentAge ?? MIN_AGE;
        const minTarget = currentAge + 1;
        const defaultTarget = Math.min(currentAge + 20, MAX_TARGET_AGE);
        const target =
          currentValue === undefined ||
          (currentValue as number) < minTarget
            ? defaultTarget
            : (currentValue as number);

        return (
          <div>
            <div className="mb-6 text-center">
              <span className="numeral text-6xl font-semibold tracking-tight md:text-7xl">
                {target}
              </span>
            </div>
            <Slider
              value={[target]}
              min={minTarget}
              max={MAX_TARGET_AGE}
              step={1}
              onValueChange={(value) =>
                updateAnswer("targetFreedomAge", value[0])
              }
              aria-label="Target freedom age"
            />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span className="numeral">{minTarget}</span>
              <span className="numeral">{MAX_TARGET_AGE}</span>
            </div>
          </div>
        );
      }

      case "currency":
        return (
          <div>
            {question.key === "desiredMonthlySpend" ? (
              <div className="mb-6">
                <CurrencySelect
                  value={answers.currency ?? "USD"}
                  onChange={(currency) => updateAnswer("currency", currency)}
                />
              </div>
            ) : null}
            <CurrencyInput
              value={currentValue as number | undefined}
              onChange={(value) =>
                updateAnswer(question.key as keyof AssessmentInput, value)
              }
              currency={answers.currency ?? "USD"}
              autoFocus
              ariaLabel={question.label}
              placeholder="0"
              className="numeral h-16 border-0 border-b-2 border-input bg-transparent pl-12 pr-0 text-3xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 md:text-4xl"
            />
          </div>
        );

      case "choice": {
        const options =
          question.key === "monthlyCapacity"
            ? getCapacityOptions(answers.currency ?? "USD")
            : (question.options ?? []);
        return (
          <ChoiceList
            value={currentValue as string | undefined}
            onChange={(value) =>
              updateAnswer(question.key as keyof AssessmentInput, value)
            }
            options={options}
          />
        );
      }

      default:
        return null;
    }
  }

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader compact />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:px-6">
        <ProgressIndicator current={step + 1} total={QUESTIONS.length} />
        <form
          className="flex flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            handleNext();
          }}
        >
          <div className="flex-1 py-8 md:py-12">
            <QuestionCard label={question.label} support={question.support} error={error}>
              {renderInput()}
            </QuestionCard>
          </div>
          <div className="sticky bottom-0 -mx-4 border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
            <div className="flex items-center gap-3">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className="shrink-0"
                >
                  Back
                </Button>
              ) : null}
              <Button type="submit" size="lg" className="flex-1">
                {isLast ? "Calculate My Freedom Number" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
