import type { ReactNode } from "react";

interface QuestionCardProps {
  label: string;
  support?: string;
  error?: string | null;
  children: ReactNode;
}

export function QuestionCard({
  label,
  support,
  error,
  children,
}: QuestionCardProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-[2rem]">
        {label}
      </h1>
      {support ? (
        <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
          {support}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
      {error ? (
        <p className="mt-4 text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
