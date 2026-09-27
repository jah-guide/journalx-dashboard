import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/ui-kit";
import type { Trade } from "@/lib/trades";
import { trades } from "@/lib/trades";

export function planAdherencePercent(list: Trade[]): number {
  if (!list.length) return 0;
  return (list.filter((t) => t.followedPlan).length / list.length) * 100;
}

export function PlanAdherenceCallout({
  list = trades,
  className,
}: {
  list?: Trade[];
  className?: string;
}) {
  const pct = planAdherencePercent(list);
  const deviated = list.filter((t) => !t.followedPlan).length;
  const tone = pct >= 80 ? "text-win" : pct >= 60 ? "text-primary" : "text-loss";

  return (
    <Panel variant="flat" className={className}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Plan adherence</p>
          <p className={`num mt-1 text-2xl font-semibold ${tone}`}>{pct.toFixed(0)}%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {deviated === 0
              ? "Every trade in this view followed the original plan."
              : `${deviated} deviation${deviated === 1 ? "" : "s"} — review process, not dollar P&L.`}
          </p>
        </div>
        {deviated > 0 ? (
          <Link
            to="/history"
            search={{ plan: "deviated" }}
            className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-primary hover:bg-accent"
          >
            Review deviations
          </Link>
        ) : null}
      </div>
    </Panel>
  );
}
