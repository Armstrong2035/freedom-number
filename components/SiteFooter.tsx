import Link from "next/link";
import { DISCLAIMER } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Okunbo Capital
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Private wealth planning for long-term financial independence.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <Link
              href="/assessment"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Find your Freedom Number
            </Link>
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
          </div>
        </div>

        <p className="mt-10 max-w-3xl border-t border-border/70 pt-6 text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Okunbo Capital. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
