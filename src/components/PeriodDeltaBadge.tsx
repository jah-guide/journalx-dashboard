import { fmtR } from "@/lib/trades";

export function PeriodDeltaBadge({
  deltaR,
  priorCount,
  periodDays,
}: {
  deltaR: number;
  priorCount: number;
  periodDays: number;
}) {
  if (priorCount === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No prior {periodDays}-day window in sample data to compare.
      </p>
    );
  }

  const tone = deltaR >= 0 ? "text-win" : "text-loss";
  const sign = deltaR > 0 ? "+" : "";

  return (
    <p className="text-xs text-muted-foreground">
      vs prior {periodDays} days:{" "}
      <span className={`num font-medium ${tone}`}>
        {sign}
        {fmtR(deltaR)}
      </span>{" "}
      ({priorCount} trades in prior window)
    </p>
  );
}
