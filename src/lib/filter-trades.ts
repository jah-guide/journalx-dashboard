import type { Outcome, Session, Trade } from "@/lib/trades";

export type TradeFilters = {
  q: string;
  pair: string;
  session: string;
  outcome: string;
  setup: string;
  review: string;
  plan: "all" | "followed" | "deviated";
  from: string;
  to: string;
};

export const defaultTradeFilters: TradeFilters = {
  q: "",
  pair: "all",
  session: "all",
  outcome: "all",
  setup: "all",
  review: "all",
  plan: "all",
  from: "",
  to: "",
};

export function filterTrades(list: Trade[], filters: TradeFilters): Trade[] {
  const needle = filters.q.trim().toLowerCase();
  return list.filter((t) => {
    const text = `${t.pair} ${t.setup} ${t.notes} ${t.planNotes} ${t.reviewNotes}`.toLowerCase();
    return (
      (needle === "" || text.includes(needle)) &&
      (filters.pair === "all" || t.pair === filters.pair) &&
      (filters.session === "all" || t.session === (filters.session as Session)) &&
      (filters.outcome === "all" || t.outcome === (filters.outcome as Outcome)) &&
      (filters.setup === "all" || t.setup === filters.setup) &&
      (filters.review === "all" ||
        (filters.review === "complete" ? Boolean(t.afterScreenshot) : !t.afterScreenshot)) &&
      (filters.plan === "all" ||
        (filters.plan === "followed" ? t.followedPlan : !t.followedPlan)) &&
      (filters.from === "" || t.date >= filters.from) &&
      (filters.to === "" || t.date <= filters.to)
    );
  });
}

export function filtersAreActive(filters: TradeFilters): boolean {
  return (
    filters.q !== "" ||
    filters.pair !== "all" ||
    filters.session !== "all" ||
    filters.outcome !== "all" ||
    filters.setup !== "all" ||
    filters.review !== "all" ||
    filters.plan !== "all" ||
    filters.from !== "" ||
    filters.to !== ""
  );
}
