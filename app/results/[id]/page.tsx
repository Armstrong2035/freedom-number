"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { loadResult } from "@/lib/storage";
import { useMounted } from "@/lib/use-mounted";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ResultsView } from "@/components/ResultsView";
import { Button } from "@/components/ui/button";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1" />
      </div>
    );
  }

  const stored = loadResult(id);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        {stored ? (
          <ResultsView stored={stored} />
        ) : (
          <main className="mx-auto w-full max-w-xl px-4 py-24 text-center sm:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Result not available
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              This result is stored on the device that created it. Start a new
              assessment to see your Freedom Number.
            </p>
            <Button asChild className="mt-8">
              <Link href="/assessment">Start Assessment</Link>
            </Button>
          </main>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
