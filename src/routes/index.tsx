import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EquityChart } from "@/components/EquityChart";
import { Bar, Metric, OutcomeBadge, Panel, RValue, SectionTitle } from "@/components/ui-kit";
import { cumulative, fmtDate, groupBy, stats, trades } from "@/lib/trades";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — JournalX Trading Journal" },
      {
        name: "description",
        content:
          "Track R-multiple performance, win rate and session edge in a focused personal trading journal.",
      },
      { property: "og:title", content: "Dashboard — JournalX Trading Journal" },
      {
        property: "og:description",
        content: "Track R-multiple performance, win rate and session edge with JournalX.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [period, setPeriod] = useState<"7" | "30" | "all">("30");
  const visibleTrades = useMemo(() => {
    if (period === "all") return trades;
    const latest = new Date(`${trades[0]?.date}T00:00:00`);
    const start = new Date(latest);
    start.setDate(start.getDate() - Number(period) + 1);
    return trades.filter((trade) => new Date(`${trade.date}T00:00:00`) >= start);
  }, [period]);
  const s = stats(visibleTrades);
  const bySession = groupBy("session", visibleTrades);
  const byPair = groupBy("pair", visibleTrades).slice(0, 5);
  const recent = visibleTrades.slice(0, 5);
  const best = bySession[0];

  return (
    <AppShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
        <p className="text-sm text-muted-foreground">Welcome back, Alex</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Your edge, at a glance</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {s.total} trades logged this cycle. You are running{" "}
          <span className="text-win">{s.totalR.toFixed(1)}R</span> with a{" "}
          {s.winRate.toFixed(0)}% win rate — strongest during the {best?.name} session.
        </p>
        </div>
        <label className="text-xs text-muted-foreground">
          <span className="sr-only">Dashboard period</span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as "7" | "30" | "all")}
            className="rounded-lg border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </label>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total R"
          value={`${s.totalR > 0 ? "+" : ""}${s.totalR.toFixed(1)}R`}
          hint={`Avg ${s.avgR.toFixed(2)}R per trade`}
          tone={s.totalR >= 0 ? "positive" : "negative"}
        />
        <Metric
          label="Win rate"
          value={`${s.winRate.toFixed(0)}%`}
          hint={`${s.wins}W · ${s.losses}L · ${s.breakevens}BE`}
        />
        <Metric label="Total trades" value={`${s.total}`} hint={period === "all" ? "All time" : `Last ${period} days`} />
        <Metric
          label="Best session"
          value={best?.name ?? "—"}
          hint={`${best?.totalR.toFixed(1)}R · ${best?.winRate.toFixed(0)}% win rate`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <SectionTitle
            action={<span className="text-xs text-muted-foreground">Cumulative R by trade</span>}
          >
            Performance
          </SectionTitle>
          <EquityChart data={cumulative(visibleTrades)} />
        </Panel>

        <Panel>
          <SectionTitle>By session</SectionTitle>
          <ul className="space-y-4">
            {bySession.map((g) => (
              <li key={g.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{g.name}</span>
                  <RValue r={g.totalR} />
                </div>
                <Bar value={g.winRate} />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {g.winRate.toFixed(0)}% win · {g.total} trades
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <SectionTitle
            action={
              <Link
                to="/history"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          >
            Recent trades
          </SectionTitle>
          <ul className="divide-y divide-border">
            {recent.map((t) => (
              <li key={t.id}>
                <Link
                  to="/history"
                  search={{ trade: t.id }}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-3 transition-colors hover:bg-accent/40"
                >
                  <img
                    src={t.screenshot}
                    alt={`${t.pair} chart screenshot`}
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="h-11 w-16 shrink-0 rounded-md border border-border object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.pair}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.session} · {fmtDate(t.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <OutcomeBadge outcome={t.outcome} />
                    <RValue r={t.r} className="w-14 text-right text-sm" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <SectionTitle>Top pairs</SectionTitle>
          <ul className="space-y-4">
            {byPair.map((g) => (
              <li key={g.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{g.name}</span>
                  <RValue r={g.totalR} />
                </div>
                <Bar value={g.winRate} />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {g.winRate.toFixed(0)}% win · {g.total} trades
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
