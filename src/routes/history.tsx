import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutcomeBadge, Panel, RValue } from "@/components/ui-kit";
import {
  OUTCOMES,
  PAIRS,
  SESSIONS,
  fmtDate,
  stats,
  trades,
  type Outcome,
  type Session,
} from "@/lib/trades";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

type SearchParams = { trade?: string | undefined };

export const Route = createFileRoute("/history")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    trade: typeof s["trade"] === "string" ? (s["trade"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Trade History — JournalX" },
      {
        name: "description",
        content: "Search and filter every logged trade by pair, session, outcome and date.",
      },
      { property: "og:title", content: "Trade History — JournalX" },
      {
        property: "og:description",
        content: "Search and filter every logged trade, then open the notes and chart screenshot.",
      },
    ],
  }),
  component: HistoryPage,
});

const selectClass =
  "rounded-lg border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";

function HistoryPage() {
  const navigate = useNavigate();
  const { trade: openId } = Route.useSearch();
  const [q, setQ] = useState("");
  const [pair, setPair] = useState("all");
  const [session, setSession] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [setup, setSetup] = useState("all");
  const [review, setReview] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const setups = useMemo(() => [...new Set(trades.map((trade) => trade.setup))].sort(), []);

  const filtered = useMemo(
    () =>
      trades.filter((t) => {
        const text = `${t.pair} ${t.setup} ${t.notes}`.toLowerCase();
        return (
          (q === "" || text.includes(q.toLowerCase())) &&
          (pair === "all" || t.pair === pair) &&
          (session === "all" || t.session === (session as Session)) &&
          (outcome === "all" || t.outcome === (outcome as Outcome)) &&
          (setup === "all" || t.setup === setup) &&
          (review === "all" || (review === "complete" ? Boolean(t.afterScreenshot) : !t.afterScreenshot)) &&
          (from === "" || t.date >= from) &&
          (to === "" || t.date <= to)
        );
      }),
    [q, pair, session, outcome, setup, review, from, to],
  );

  const clearFilters = () => {
    setQ(""); setPair("all"); setSession("all"); setOutcome("all"); setSetup("all"); setReview("all"); setFrom(""); setTo("");
  };

  const s = stats(filtered);
  const active = trades.find((t) => t.id === openId) ?? null;
  const close = () => navigate({ to: "/history", search: {} });

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Trade history</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filtered.length} trades · {s.totalR > 0 ? "+" : ""}
          {s.totalR.toFixed(1)}R · {s.winRate.toFixed(0)}% win rate
        </p>
      </header>

      <Panel className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pair, setup, notes…"
              aria-label="Search trades"
              className="w-full rounded-lg border border-input bg-panel py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>
          <select
            aria-label="Filter by pair"
            className={selectClass}
            value={pair}
            onChange={(e) => setPair(e.target.value)}
          >
            <option value="all">All pairs</option>
            {PAIRS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by session"
            className={selectClass}
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="all">All sessions</option>
            {SESSIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by outcome"
            className={selectClass}
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
          >
            <option value="all">All outcomes</option>
            {OUTCOMES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="date"
            aria-label="From date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={cn(selectClass, "num")}
          />
          <input
            type="date"
            aria-label="To date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={cn(selectClass, "num")}
          />
          <select aria-label="Filter by setup" className={selectClass} value={setup} onChange={(e) => setSetup(e.target.value)}>
            <option value="all">All setups</option>
            {setups.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select aria-label="Filter by review status" className={selectClass} value={review} onChange={(e) => setReview(e.target.value)}>
            <option value="all">All reviews</option>
            <option value="complete">Review complete</option>
            <option value="pending">Needs review</option>
          </select>
          <button type="button" onClick={clearFilters} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            Clear filters
          </button>
        </div>
      </Panel>

      <div className="hidden panel overflow-hidden lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Pair</th>
              <th className="px-5 py-3 font-medium">Session</th>
              <th className="px-5 py-3 font-medium">Setup</th>
              <th className="px-5 py-3 font-medium">Planned R:R</th>
              <th className="px-5 py-3 font-medium">Outcome</th>
              <th className="px-5 py-3 text-right font-medium">Achieved R</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                onClick={() => navigate({ to: "/history", search: { trade: t.id } })}
                className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
              >
                <td className="num px-5 py-3 text-muted-foreground">{fmtDate(t.date)}</td>
                <td className="px-5 py-3 font-medium">{t.pair}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.session}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.setup}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.plannedReward}</td>
                <td className="px-5 py-3">
                  <OutcomeBadge outcome={t.outcome} />
                </td>
                <td className="px-5 py-3 text-right">
                  <RValue r={t.r} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No trades match these filters.
          </p>
        ) : null}
      </div>

      <ul className="space-y-3 lg:hidden">
        {filtered.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => navigate({ to: "/history", search: { trade: t.id } })}
              className="panel flex w-full items-center gap-3 p-3 text-left"
            >
              <img
                src={t.screenshot}
                alt=""
                loading="lazy"
                width={1024}
                height={640}
                className="h-12 w-16 shrink-0 rounded-md border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.pair}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.session} · {fmtDate(t.date)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <RValue r={t.r} className="text-sm" />
                <OutcomeBadge outcome={t.outcome} />
              </div>
            </button>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="panel p-8 text-center text-sm text-muted-foreground">
            No trades match these filters.
          </li>
        ) : null}
      </ul>

      {active ? (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-t-2xl border border-border bg-card p-5 sm:rounded-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{active.pair}</h2>
                <p className="text-xs text-muted-foreground">
                  {active.session} session · {fmtDate(active.date)} · {active.id}
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close trade detail"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <OutcomeBadge outcome={active.outcome} />
              <RValue r={active.r} className="text-lg" />
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                {active.setup}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <section className="rounded-xl border border-border bg-panel/40 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Before the trade</p>
                <p className="mt-2 text-sm font-medium">Planned risk-to-reward: {active.plannedReward}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">{active.planNotes}</p>
                <img
                  src={active.beforeScreenshot}
                  alt={`${active.pair} chart before entry`}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="mt-4 aspect-[4/3] w-full rounded-lg border border-border object-cover"
                />
              </section>

              <section className="rounded-xl border border-border bg-panel/40 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">After the trade</p>
                <p className="mt-2 text-sm font-medium">Achieved reward: <RValue r={active.r} className="inline" /></p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">{active.reviewNotes}</p>
                {active.afterScreenshot ? (
                  <img
                    src={active.afterScreenshot}
                    alt={`${active.pair} chart after exit`}
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="mt-4 aspect-[4/3] w-full rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="mt-4 grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-border px-4 text-center text-xs text-muted-foreground">
                    No after-trade chart saved
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
