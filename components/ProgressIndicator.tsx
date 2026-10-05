import { Progress } from "./ui/progress";

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full" aria-label={`Question ${current} of ${total}`}>
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-wide">
          Question {current} of {total}
        </span>
        <span className="numeral">{percentage}%</span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
