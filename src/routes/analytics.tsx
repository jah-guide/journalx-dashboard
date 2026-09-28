import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PlanAdherenceCallout } from "@/components/PlanAdherenceCallout";
import { EquityChart } from "@/components/EquityChart";
import { Bar, Metric, PageHeader, Panel, RValue, SectionTitle } from "@/components/ui-kit";
import { cumulative, groupBy, stats, trades } from "@/lib/trades";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — JournalX" },
      {
        name: "description",
        content:
          "Break down win rate and average R by trading pair and session, plus your cumulative R trend.",
      },
      { property: "og:title", content: "Analytics — JournalX" },
      {
        property: "og:description",
        content: "Win rate and average R by pair and session, with a cumulative R trend.",
      },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const s = stats();
  const byPair = groupBy("pair");
  const bySession = groupBy("session");
  const bySetup = groupBy("setup");
  const planAdherence = (trades.filter((trade) => trade.followedPlan).length / trades.length) * 100;
  const averagePlannedReward = trades.reduce((sum, trade) => sum + Number(trade.plannedReward.split(":")[1]), 0) / trades.length;
  const recentDeviations = trades.filter((trade) => !trade.followedPlan).slice(0, 4);

  return (
    <AppShell>
      <PageHeader
        title="Analytics"
        description="Planned vs achieved R, adherence, and breakdowns by session, pair, and setup."
      />

      <PlanAdherenceCallout className="mb-6" />

      {trades.length < 12 ? (
        <Panel variant="flat" className="mb-6 border-primary/25 bg-primary/5">
          <p className="text-sm text-foreground/90">
            <span className="font-medium text-primary">Small sample.</span> With fewer than 12 trades,
            treat breakdowns as directional — not statistical edge.
          </p>
        </Panel>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Wins" value={`${s.wins}`} tone="positive" hint="Closed in profit" />
        <Metric label="Losses" value={`${s.losses}`} tone="negative" hint="Full stop hit" />
        <Metric label="Breakevens" value={`${s.breakevens}`} hint="Scratched at entry" />
        <Metric
          label="Cumulative R"
          value={`${s.totalR > 0 ? "+" : ""}${s.totalR.toFixed(1)}R`}
          tone={s.totalR >= 0 ? "positive" : "negative"}
          hint={`Avg ${s.avgR.toFixed(2)}R per trade`}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Panel>
          <SectionTitle>Plan adherence</SectionTitle>
          <p className="num text-3xl font-semibold text-primary">{planAdherence.toFixed(0)}%</p>
          <p className="mt-2 text-sm text-muted-foreground">Trades marked as following the original plan.</p>
        </Panel>
        <Panel>
          <SectionTitle>Planned reward</SectionTitle>
          <p className="num text-3xl font-semibold">1:{averagePlannedReward.toFixed(1)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Average target relative to one unit of risk.</p>
        </Panel>
        <Panel>
          <SectionTitle>Achieved reward</SectionTitle>
          <p className={s.avgR >= 0 ? "text-3xl font-semibold text-win" : "text-3xl font-semibold text-loss"}>{s.avgR >= 0 ? "+" : ""}{s.avgR.toFixed(2)}R</p>
          <p className="mt-2 text-sm text-muted-foreground">Average result relative to one unit of risk.</p>
        </Panel>
      </div>

      <Panel className="mt-6">
        <SectionTitle
          action={<span className="text-xs text-muted-foreground">Cumulative R trend</span>}
        >
          Equity curve
        </SectionTitle>
        <EquityChart data={cumulative()} height={280} />
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel>
          <SectionTitle>By session</SectionTitle>
          <BreakdownTable rows={bySession} />
        </Panel>
        <Panel>
          <SectionTitle>By pair</SectionTitle>
          <BreakdownTable rows={byPair} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel>
          <SectionTitle>By setup</SectionTitle>
          <BreakdownTable rows={bySetup} />
        </Panel>
        <Panel>
          <SectionTitle
            action={
              <Link
                to="/history"
                search={{ plan: "deviated" }}
                className="text-xs font-medium text-primary hover:underline"
              >
                View all deviations
              </Link>
            }
          >
            Recent plan deviations
          </SectionTitle>
          {recentDeviations.length ? (
            <ul className="space-y-3">
              {recentDeviations.map((trade) => (
                <li key={trade.id}>
                  <Link
                    to="/history"
                    search={{ trade: trade.id }}
                    className="block rounded-lg border border-border/70 px-3 py-2.5 text-sm transition-colors hover:bg-accent/40"
                  >
                    <span className="font-medium">{trade.pair}</span>
                    <span className="text-muted-foreground"> · {trade.setup}</span>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{trade.reviewNotes}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No deviations in the sample log.</p>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

function BreakdownTable({
  rows,
}: {
  rows: { name: string; total: number; winRate: number; avgR: number; totalR: number }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Win rate</th>
            <th className="py-2 text-right font-medium">Avg R</th>
            <th className="py-2 text-right font-medium">Total R</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border/60 last:border-0">
              <td className="py-3">
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.total} trades</p>
                {row.total < 8 ? <p className="mt-1 text-xs text-muted-foreground">Exploratory — fewer than 8 trades</p> : <p className="mt-1 text-xs text-primary">Enough trades to watch closely</p>}
              </td>
              <td className="py-3 pr-6">
                <div className="max-w-[140px]">
                  <Bar value={row.winRate} />
                  <p className="num mt-1.5 text-xs text-muted-foreground">
                    {row.winRate.toFixed(0)}%
                  </p>
                </div>
              </td>
              <td className="num py-3 text-right text-muted-foreground">{row.avgR.toFixed(2)}R</td>
              <td className="py-3 text-right">
                <RValue r={row.totalR} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
