import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EquityChart } from "@/components/EquityChart";
import {
  Metric,
  OutcomeBadge,
  PageHeader,
  Panel,
  RValue,
  SectionTitle,
  StatRow,
  formInputClass,
} from "@/components/ui-kit";
import { PlanAdherenceCallout } from "@/components/PlanAdherenceCallout";
import { PeriodDeltaBadge } from "@/components/PeriodDeltaBadge";
import { periodDeltaR, tradesForPeriod, type PeriodKey } from "@/lib/period-compare";
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
  const [period, setPeriod] = useState<PeriodKey>("30");
  const visibleTrades = useMemo(() => tradesForPeriod(period), [period]);
  const delta = useMemo(() => periodDeltaR(period), [period]);
  const s = stats(visibleTrades);
  const bySession = groupBy("session", visibleTrades);
  const byPair = groupBy("pair", visibleTrades).slice(0, 5);
  const recent = visibleTrades.slice(0, 5);
  const best = bySession[0];

  const periodLabel = period === "all" ? "all time" : `the last ${period} days`;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Welcome back, Alex"
        title="Your edge, at a glance"
        description={
          <>
            {s.total} trades in {periodLabel}. Running{" "}
            <span className="num font-medium text-win">
              {s.totalR > 0 ? "+" : ""}
              {s.totalR.toFixed(1)}R
            </span>{" "}
            at {s.winRate.toFixed(0)}% win rate
            {best ? ` — strongest in ${best.name}.` : "."}
          </>
        }
        action={
          <label className="flex flex-col gap-1.5 text-right">
            <span className="label-caps">Period</span>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as "7" | "30" | "all")}
              className={`${formInputClass} min-w-[140px]`}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </label>
        }
      />

      <PlanAdherenceCallout list={visibleTrades} className="mb-6 border-primary/20" />

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
        <Metric
          label="Total trades"
          value={`${s.total}`}
          hint={period === "all" ? "All time" : `Last ${period} days`}
        />
        <Metric
          label="Best session"
          value={best?.name ?? "—"}
          hint={
            best
              ? `${best.totalR.toFixed(1)}R · ${best.winRate.toFixed(0)}% win rate`
              : "Log trades to compare sessions"
          }
        />
      </div>

      {period !== "all" ? (
        <div className="mt-4">
          <PeriodDeltaBadge
            deltaR={delta.deltaR}
            priorCount={delta.priorCount}
            periodDays={Number(period)}
          />
        </div>
      ) : null}

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
          <ul className="space-y-5">
            {bySession.map((g) => (
              <StatRow
                key={g.name}
                name={g.name}
                totalR={g.totalR}
                winRate={g.winRate}
                total={g.total}
              />
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
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          >
            Recent trades
          </SectionTitle>
          <ul className="divide-y divide-border/70">
            {recent.map((t) => (
              <li key={t.id}>
                <Link
                  to="/history"
                  search={{ trade: t.id }}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-3.5 transition-colors hover:bg-accent/30 -mx-2 px-2 rounded-lg"
                >
                  <img
                    src={t.screenshot}
                    alt={`${t.pair} chart screenshot`}
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="h-12 w-[4.5rem] shrink-0 rounded-md border border-border/80 object-cover"
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
          <ul className="space-y-5">
            {byPair.map((g) => (
              <StatRow
                key={g.name}
                name={g.name}
                totalR={g.totalR}
                winRate={g.winRate}
                total={g.total}
              />
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
