"use client";

import * as React from "react";
import { Share2 } from "lucide-react";
import { buildProjectionSeries } from "@/lib/calculations";
import { isQualified } from "@/lib/questions";
import {
  formatCompactCurrency,
  formatCurrency,
  roundContribution,
} from "@/lib/formatting";
import { track } from "@/lib/analytics";
import { DISCLAIMER } from "@/lib/content";
import type { StoredResult } from "@/types/assessment";
import { FreedomNumberHero } from "@/components/FreedomNumberHero";
import { PortfolioChart } from "@/components/PortfolioChart";
import { ResultsSummary } from "@/components/ResultsSummary";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { LeadCapture } from "@/components/LeadCapture";
import { AssumptionsDrawer } from "@/components/AssumptionsDrawer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ResultsViewProps {
  stored: StoredResult;
}

export function ResultsView({ stored }: ResultsViewProps) {
  const { input, result } = stored;
  const currency = input.currency;
  const qualified = isQualified(input.monthlyCapacity);
  const series = buildProjectionSeries(input);
  const displayGap = Math.max(0, result.freedomGap);
  const required = roundContribution(result.requiredMonthlyContribution);
  const progress = Math.round(result.progressPercentage);
  const [shareLabel, setShareLabel] = React.useState("Share My Freedom Number");

  React.useEffect(() => {
    track("results_viewed", { id: stored.id });
  }, [stored.id]);

  async function handleShare() {
    const text = `My Freedom Number: ${formatCompactCurrency(
      result.freedomNumber,
      currency,
    )} — target age ${input.targetFreedomAge}.`;
    track("share_clicked", { id: stored.id });

    const nav: Navigator | null =
      typeof navigator !== "undefined" ? navigator : null;

    if (nav && typeof nav.share === "function") {
      try {
        await nav.share({ text });
      } catch {
        // User dismissed the share sheet.
      }
      return;
    }

    try {
      if (nav) {
        await nav.clipboard.writeText(text);
        setShareLabel("Copied");
        setTimeout(() => setShareLabel("Share My Freedom Number"), 2000);
      }
    } catch {
      // Clipboard unavailable.
    }
  }

  const monthlyCopy =
    displayGap <= 0
      ? "On these assumptions, your current investment trajectory could meet or exceed your estimated Freedom Number."
      : `On these assumptions, increasing your long-term monthly contribution by approximately ${formatCurrency(
          Math.max(0, required - input.monthlyContribution),
          currency,
        )} could materially improve your probability of reaching the target by age ${
          input.targetFreedomAge
        }.`;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <section>
        <FreedomNumberHero
          freedomNumber={result.freedomNumber}
          currency={currency}
        />
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            {shareLabel}
          </Button>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your projected portfolio
          </p>
          <p className="numeral mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            {formatCurrency(result.projectedPortfolio, currency)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {progress}% of your estimated Freedom Number
          </p>
        </div>
        <Progress value={progress} className="mt-6 h-2.5" />
        {displayGap > 0 ? (
          <div className="mt-8 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estimated gap
            </p>
            <p className="numeral mt-1 text-2xl font-semibold tracking-tight">
              {formatCurrency(displayGap, currency)}
            </p>
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            On these assumptions, your current investment trajectory could meet
            or exceed your estimated Freedom Number.
          </p>
        )}
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">
          Current trajectory
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Projected portfolio value versus your Freedom Number target.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-card p-4 md:p-6">
          <PortfolioChart
            series={series}
            freedomNumber={result.freedomNumber}
            currency={currency}
          />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">
          Monthly investment path
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Your current contribution
            </p>
            <p className="numeral mt-2 text-xl font-semibold tracking-tight">
              {formatCurrency(input.monthlyContribution, currency)}
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estimated to reach your target
            </p>
            <p className="numeral mt-2 text-xl font-semibold tracking-tight">
              {formatCurrency(required, currency)}
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {monthlyCopy}
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">Your summary</h2>
        <div className="mt-4">
          <ResultsSummary input={input} result={result} />
        </div>
      </section>

      <section className="mt-14">
        <ConsultationCTA qualified={qualified} resultId={stored.id} />
      </section>

      <section id="lead-capture" className="mt-14 scroll-mt-6">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <h2 className="text-xl font-semibold tracking-tight">
            Want to keep your Freedom Number?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We will email you a copy of your results so you can revisit your
            assumptions later.
          </p>
          <div className="mt-6">
            <LeadCapture resultId={stored.id} />
          </div>
        </div>
      </section>

      <section className="mt-14 text-center">
        <AssumptionsDrawer />
        <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>
      </section>
    </main>
  );
}
