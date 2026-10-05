"use client";

import { CONSULTATION_URL } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

interface ConsultationCTAProps {
  qualified: boolean;
  resultId: string;
}

export function ConsultationCTA({ qualified, resultId }: ConsultationCTAProps) {
  function scrollToLeadCapture() {
    document
      .getElementById("lead-capture")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleConsultationClick() {
    track("consultation_clicked", { resultId, qualified });
  }

  if (qualified) {
    return (
      <section className="rounded-2xl border border-border bg-card p-8 text-center md:p-10">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Turn your Freedom Number into an investment plan.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          A calculator can show you the destination. The investment strategy —
          asset allocation, contribution plan, risk management and portfolio
          construction — requires more context. Okunbo Capital helps clients
          build and manage portfolios around long-term financial goals.
        </p>
        <Button
          size="lg"
          className="mt-6"
          onClick={handleConsultationClick}
          asChild
        >
          <a href={CONSULTATION_URL} target="_blank" rel="noopener noreferrer">
            Book a Consultation
          </a>
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-8 text-center md:p-10">
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
        Your Freedom Number gives you a useful target to work toward.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
        Okunbo Capital currently works with clients investing from approximately
        $1,000 per month. You can save your results and revisit your investment
        strategy as your contribution capacity grows.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={scrollToLeadCapture}>
          Email Me My Results
        </Button>
        <Button size="lg" variant="outline" onClick={handleConsultationClick} asChild>
          <a href={CONSULTATION_URL} target="_blank" rel="noopener noreferrer">
            Learn About Okunbo Capital
          </a>
        </Button>
      </div>
    </section>
  );
}
