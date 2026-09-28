import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CopyTradeLink } from "@/components/CopyTradeLink";
import { EmptyState } from "@/components/EmptyState";
import { FilterSummaryPills } from "@/components/FilterSummaryPills";
import { QuickFilterChips } from "@/components/QuickFilterChips";
import { OutcomeBadge, PageHeader, Panel, RValue, formInputClass } from "@/components/ui-kit";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { downloadTradesJson } from "@/lib/export-trades";
import {
  defaultTradeFilters,
  filterTrades,
  filtersAreActive,
  type TradeFilters,
} from "@/lib/filter-trades";
import { OUTCOMES, PAIRS, SESSIONS, fmtDate, stats, trades } from "@/lib/trades";
import { cn } from "@/lib/utils";
import { Download, FilterX, Search, X } from "lucide-react";
import { toast } from "sonner";

type SearchParams = { trade?: string; plan?: "followed" | "deviated" };

export const Route = createFileRoute("/history")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    trade: typeof s["trade"] === "string" ? s["trade"] : undefined,
    plan:
      s["plan"] === "followed" || s["plan"] === "deviated"
        ? (s["plan"] as "followed" | "deviated")
        : undefined,
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

const selectClass = formInputClass;

function HistoryPage() {
  const navigate = useNavigate();
  const { trade: openId, plan: planFromUrl } = Route.useSearch();
  const searchRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<TradeFilters>({
    ...defaultTradeFilters,
    plan: planFromUrl ?? "all",
  });

  const patch = (partial: Partial<TradeFilters>) =>
    setFilters((current) => ({ ...current, ...partial }));

  const setups = useMemo(() => [...new Set(trades.map((trade) => trade.setup))].sort(), []);
  const topSetups = useMemo(() => setups.slice(0, 4), [setups]);

  const sessionChips = useMemo(
    () => [{ id: "all", label: "All sessions" }, ...SESSIONS.map((name) => ({ id: name, label: name }))],
    [],
  );

  const setupChips = useMemo(
    () => [{ id: "all", label: "All setups" }, ...topSetups.map((name) => ({ id: name, label: name }))],
    [topSetups],
  );

  const filtered = useMemo(() => filterTrades(trades, filters), [filters]);
  const activeFilters = filtersAreActive(filters);

  const clearFilters = () => {
    setFilters(defaultTradeFilters);
    navigate({ to: "/history", search: {} });
  };

  const exportFiltered = () => {
    downloadTradesJson(filtered);
    toast.success(`Exported ${filtered.length} trade${filtered.length === 1 ? "" : "s"} as JSON.`);
  };

  const s = stats(filtered);
  const active = trades.find((t) => t.id === openId) ?? null;
  const close = () =>
    navigate({
      to: "/history",
      search: filters.plan !== "all" ? { plan: filters.plan } : {},
    });

  useKeyboardShortcuts([
    { key: "/", handler: () => searchRef.current?.focus() },
    { key: "Escape", when: () => Boolean(openId), handler: close },
    { key: "e", mod: true, handler: exportFiltered },
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Trade history"
        action={
          <button
            type="button"
            onClick={exportFiltered}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:w-auto sm:justify-start"
          >
            <Download className="h-4 w-4 shrink-0" />
            Export JSON
          </button>
        }
        description={
          <>
            {filtered.length} trades ·{" "}
            <span className="num">
              {s.totalR > 0 ? "+" : ""}
              {s.totalR.toFixed(1)}R
            </span>{" "}
            · {s.winRate.toFixed(0)}% win rate · {s.wins}W / {s.losses}L / {s.breakevens}BE
            {filters.plan === "deviated" ? " · deviations only" : null}
          </>
        }
      />

      <Panel className="mb-6 space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Session
          </p>
          <QuickFilterChips
            chips={sessionChips}
            activeId={filters.session}
            onSelect={(id) => patch({ session: id })}
            ariaLabel="Filter by session"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Setup
          </p>
          <QuickFilterChips
            chips={setupChips}
            activeId={filters.setup}
            onSelect={(id) => patch({ setup: id })}
            ariaLabel="Filter by setup"
          />
        </div>
        <FilterSummaryPills filters={filters} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={filters.q}
              onChange={(e) => patch({ q: e.target.value })}
              placeholder="Search pair, setup, notes… (/ to focus)"
              aria-label="Search trades"
              className="w-full rounded-lg border border-input bg-panel py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>
          <select
            aria-label="Filter by pair"
            className={selectClass}
            value={filters.pair}
            onChange={(e) => patch({ pair: e.target.value })}
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
            value={filters.session}
            onChange={(e) => patch({ session: e.target.value })}
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
            value={filters.outcome}
            onChange={(e) => patch({ outcome: e.target.value })}
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
            value={filters.from}
            onChange={(e) => patch({ from: e.target.value })}
            className={cn(selectClass, "num")}
          />
          <input
            type="date"
            aria-label="To date"
            value={filters.to}
            onChange={(e) => patch({ to: e.target.value })}
            className={cn(selectClass, "num")}
          />
          <select
            aria-label="Filter by setup"
            className={selectClass}
            value={filters.setup}
            onChange={(e) => patch({ setup: e.target.value })}
          >
            <option value="all">All setups</option>
            {setups.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by review status"
            className={selectClass}
            value={filters.review}
            onChange={(e) => patch({ review: e.target.value })}
          >
            <option value="all">All reviews</option>
            <option value="complete">Review complete</option>
            <option value="pending">Needs review</option>
          </select>
          <select
            aria-label="Filter by plan adherence"
            className={selectClass}
            value={filters.plan}
            onChange={(e) => {
              const value = e.target.value as TradeFilters["plan"];
              patch({ plan: value });
              navigate({
                to: "/history",
                search: value === "all" ? {} : { plan: value },
              });
            }}
          >
            <option value="all">All plan adherence</option>
            <option value="followed">Followed plan</option>
            <option value="deviated">Deviated from plan</option>
          </select>
          <button
            type="button"
            disabled={!activeFilters}
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FilterX className="h-4 w-4" />
            Clear filters
          </button>
        </div>
      </Panel>

      <div className="panel hidden overflow-x-auto md:block">
        <table className="w-full min-w-[44rem] text-sm">
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
                onClick={() =>
                  navigate({
                    to: "/history",
                    search: { trade: t.id, ...(filters.plan !== "all" ? { plan: filters.plan } : {}) },
                  })
                }
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
          <EmptyState
            className="mx-5 mb-5 border-none bg-transparent"
            title="No trades match"
            description="Widen filters or reset to browse the full sample log."
            action={
              activeFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Reset filters
                </button>
              ) : null
            }
          />
        ) : null}
      </div>

      <ul className="space-y-3 md:hidden">
        {filtered.map((t) => (
          <li key={t.id}>
            <button
              onClick={() =>
                navigate({
                  to: "/history",
                  search: { trade: t.id, ...(filters.plan !== "all" ? { plan: filters.plan } : {}) },
                })
              }
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
          <li>
            <EmptyState title="No trades match" description="Adjust quick filters or date range." />
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
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-t-2xl border border-border bg-card p-5 shadow-2xl sm:rounded-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{active.pair}</h2>
                <p className="text-xs text-muted-foreground">
                  {active.session} session · {fmtDate(active.date)} · {active.id}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <CopyTradeLink tradeId={active.id} />
                <button
                  onClick={close}
                  aria-label="Close trade detail"
                  className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <OutcomeBadge outcome={active.outcome} />
              <RValue r={active.r} className="text-lg" />
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                {active.setup}
              </span>
              {active.followedPlan ? (
                <span className="rounded-full border border-win/30 bg-win/10 px-2.5 py-0.5 text-[11px] font-medium text-win">
                  Followed plan
                </span>
              ) : (
                <span className="rounded-full border border-loss/40 bg-loss/10 px-2.5 py-0.5 text-[11px] font-medium text-loss">
                  Deviated from plan
                </span>
              )}
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
                <p className="mt-2 text-sm font-medium">
                  Achieved reward: <RValue r={active.r} className="inline" />
                </p>
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
