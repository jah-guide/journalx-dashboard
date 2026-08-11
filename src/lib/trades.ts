import chart1 from "@/assets/chart-1.jpg";
import chart2 from "@/assets/chart-2.jpg";
import chart3 from "@/assets/chart-3.jpg";

export type Session = "Asian" | "London" | "New York";
export type Outcome = "Win" | "Loss" | "Breakeven";

export type Trade = {
  id: string;
  date: string; // ISO date
  pair: string;
  session: Session;
  outcome: Outcome;
  plannedReward: string;
  followedPlan: boolean;
  r: number;
  setup: string;
  planNotes: string;
  reviewNotes: string;
  beforeScreenshot: string;
  afterScreenshot?: string;
  notes: string;
  screenshot: string;
};

export const PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "GBP/JPY",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "EUR/JPY",
  "XAU/USD",
  "BTC/USD",
  "ETH/USD",
  "US30",
  "NAS100",
];

export const SESSIONS: Session[] = ["Asian", "London", "New York"];
export const OUTCOMES: Outcome[] = ["Win", "Loss", "Breakeven"];

const shots = [chart1, chart2, chart3];

type Seed = [string, string, Session, Outcome, number, string, string];

const seed: Seed[] = [
  ["2026-08-10", "GBP/JPY", "London", "Win", 3.2, "Liquidity sweep", "Clean sweep of Asian high, displacement on M5, entered on FVG retest. Held to the daily level."],
  ["2026-08-10", "EUR/USD", "New York", "Loss", -1, "Breaker block", "Chased the entry after news. Structure was still bearish — avoid counter-trend during NY open."],
  ["2026-08-09", "XAU/USD", "London", "Win", 2.4, "Order block", "Textbook OB retest off the 4H demand. Partial at 2R, trailed the rest."],
  ["2026-08-08", "US30", "New York", "Breakeven", 0, "Range fade", "Moved stop to entry too early, price came back and tagged it before running."],
  ["2026-08-08", "USD/JPY", "Asian", "Win", 1.8, "Asian range break", "Range expansion after the Tokyo open, held the retest well."],
  ["2026-08-07", "GBP/USD", "London", "Win", 4.1, "Liquidity sweep", "Best trade of the week. Sweep, shift, entry on the 15m FVG. Full target hit."],
  ["2026-08-07", "BTC/USD", "Asian", "Loss", -1, "Trendline break", "Low conviction setup, small consolidation only. Should have skipped it."],
  ["2026-08-06", "NAS100", "New York", "Win", 2.9, "Opening drive", "Waited for the 9:45 pullback, entered on the first higher low."],
  ["2026-08-06", "EUR/JPY", "London", "Loss", -1, "Order block", "Stop was too tight for the volatility of this pair."],
  ["2026-08-05", "EUR/USD", "London", "Win", 1.5, "FVG retest", "Slow grind but clean. Took profit at the session high."],
  ["2026-08-05", "AUD/USD", "Asian", "Breakeven", 0, "Range fade", "Choppy session, exited flat when momentum stalled."],
  ["2026-08-04", "XAU/USD", "New York", "Win", 3.6, "Liquidity sweep", "Sweep of the prior day low then a strong reclaim. Scaled out in thirds."],
  ["2026-08-04", "USD/CAD", "New York", "Loss", -1, "Breaker block", "Entered before the oil data — unnecessary risk."],
  ["2026-08-03", "GBP/JPY", "Asian", "Win", 2.1, "Asian range break", "Small but clean. Followed the plan exactly."],
  ["2026-08-01", "NAS100", "New York", "Win", 2.6, "Opening drive", "Momentum continuation after the first 30 minutes."],
  ["2026-07-31", "GBP/USD", "London", "Loss", -1, "FVG retest", "FVG was already mitigated. Missed that in prep."],
  ["2026-07-31", "USD/JPY", "Asian", "Win", 1.2, "Order block", "Quick scalp into the session high."],
  ["2026-07-30", "ETH/USD", "New York", "Win", 3.0, "Trendline break", "Strong break and retest, held the whole leg."],
  ["2026-07-30", "EUR/USD", "London", "Breakeven", 0, "Liquidity sweep", "Sweep happened but no displacement — exited flat."],
  ["2026-07-29", "XAU/USD", "London", "Win", 2.2, "Order block", "Second entry after the first was stopped. Patience paid."],
  ["2026-07-29", "US30", "New York", "Loss", -1, "Range fade", "Faded a trend day. Never fade a trend day."],
  ["2026-07-28", "GBP/JPY", "London", "Win", 3.4, "Liquidity sweep", "London open sweep, held to the weekly level."],
  ["2026-07-28", "NZD/USD", "Asian", "Loss", -1, "Asian range break", "False break, price returned into the range immediately."],
  ["2026-07-27", "NAS100", "New York", "Win", 1.9, "FVG retest", "Solid execution, cut short due to time constraints."],
];

export const trades: Trade[] = seed
  .map(([date, pair, session, outcome, r, setup, notes], i) => ({
    id: `T-${String(seed.length - i).padStart(3, "0")}`,
    date,
    pair,
    session,
    outcome,
    plannedReward: `1:${Math.max(1, Math.abs(r)).toFixed(1).replace(".0", "")}`,
    followedPlan: i % 5 !== 1,
    r,
    setup,
    planNotes: `Planned ${setup.toLowerCase()} setup during the ${session} session.`,
    reviewNotes: notes,
    beforeScreenshot: shots[i % shots.length]!,
    afterScreenshot: outcome === "Breakeven" ? undefined : shots[(i + 1) % shots.length]!,
    notes,
    screenshot: shots[i % shots.length]!,
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const fmtR = (r: number) => `${r > 0 ? "+" : ""}${r.toFixed(1)}R`;

export const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function stats(list: Trade[] = trades) {
  const totalR = list.reduce((s, t) => s + t.r, 0);
  const wins = list.filter((t) => t.outcome === "Win").length;
  const losses = list.filter((t) => t.outcome === "Loss").length;
  const breakevens = list.filter((t) => t.outcome === "Breakeven").length;
  const decided = wins + losses;
  return {
    totalR,
    wins,
    losses,
    breakevens,
    total: list.length,
    winRate: decided ? (wins / decided) * 100 : 0,
    avgR: list.length ? totalR / list.length : 0,
  };
}

export function groupBy(key: "session" | "pair" | "setup", list: Trade[] = trades) {
  const map = new Map<string, Trade[]>();
  for (const t of list) {
    const k = t[key];
    map.set(k, [...(map.get(k) ?? []), t]);
  }
  return [...map.entries()]
    .map(([name, items]) => ({ name, ...stats(items) }))
    .sort((a, b) => b.totalR - a.totalR);
}

export function cumulative(list: Trade[] = trades) {
  const asc = [...list].sort((a, b) => (a.date > b.date ? 1 : -1));
  let run = 0;
  return asc.map((t, i) => {
    run += t.r;
    return { label: `${i + 1}`, date: fmtDate(t.date), r: Number(run.toFixed(1)) };
  });
}

export const bestSession = () => groupBy("session")[0];
