import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TrackView } from "@/components/TrackView";
import { Button } from "@/components/ui/button";

const LEARN_POINTS = [
  {
    title: "Your lifestyle target",
    description:
      "The monthly income you want your investments to support.",
  },
  {
    title: "The capital required",
    description:
      "An estimate of the invested capital that could support that lifestyle.",
  },
  {
    title: "Where you stand",
    description:
      "How your current assets and contributions compare to that target.",
  },
  {
    title: "Your next move",
    description:
      "An approximate monthly contribution that could improve your trajectory.",
  },
];

const STEPS = [
  {
    title: "Answer a few questions",
    description: "About the life you want and your current investments.",
  },
  {
    title: "See your Freedom Number",
    description:
      "And how your current trajectory compares to that estimate.",
  },
  {
    title: "Build the strategy",
    description:
      "Turn the estimate into an investment plan with Okunbo Capital.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <TrackView event="landing_view" />
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 md:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Okunbo Capital
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Find Your Freedom Number
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            How much invested capital would you need for work to become
            optional? Answer a few questions about the life you want, your
            current investments, and how long you have to build wealth.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We will estimate your Freedom Number and show how your current
            investment trajectory compares.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Button asChild size="lg" className="w-full max-w-sm">
              <Link href="/assessment">Calculate My Freedom Number</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Takes about 3 minutes. No commitment required.
            </p>
          </div>
        </section>

        <section className="border-t border-border/70 bg-card">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20">
            <div className="grid gap-6 sm:grid-cols-2">
              {LEARN_POINTS.map((point) => (
                <div
                  key={point.title}
                  className="rounded-xl border border-border p-6"
                >
                  <h2 className="text-base font-semibold tracking-tight">
                    {point.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/assessment">Calculate My Freedom Number</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
