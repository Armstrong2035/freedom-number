import Link from "next/link";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  compact?: boolean;
}

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border/70 bg-background/80 backdrop-blur",
        compact && "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="h-3 w-3 rounded-full bg-primary-foreground" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Okunbo Capital
          </span>
        </Link>
        {!compact ? (
          <span className="hidden text-sm text-muted-foreground sm:block">
            Private wealth planning
          </span>
        ) : null}
      </div>
    </header>
  );
}
