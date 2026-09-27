import { stats, trades, type Trade } from "@/lib/trades";

export type PeriodKey = "7" | "30" | "all";

export function tradesForPeriod(period: PeriodKey, list: Trade[] = trades): Trade[] {
  if (period === "all") return list;
  const latest = new Date(`${list[0]?.date ?? "1970-01-01"}T00:00:00`);
  const start = new Date(latest);
  start.setDate(start.getDate() - Number(period) + 1);
  return list.filter((trade) => new Date(`${trade.date}T00:00:00`) >= start);
}

export function priorPeriodTrades(period: PeriodKey, list: Trade[] = trades): Trade[] {
  if (period === "all") return [];
  const days = Number(period);
  const current = tradesForPeriod(period, list);
  if (!current.length) return [];
  const earliestCurrent = current.reduce(
    (min, t) => (t.date < min ? t.date : min),
    current[0]!.date,
  );
  const end = new Date(`${earliestCurrent}T00:00:00`);
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return list.filter((trade) => {
    const d = new Date(`${trade.date}T00:00:00`);
    return d >= start && d <= end;
  });
}

export function periodDeltaR(period: PeriodKey, list: Trade[] = trades) {
  const current = stats(tradesForPeriod(period, list));
  const prior = stats(priorPeriodTrades(period, list));
  return {
    currentTotalR: current.totalR,
    priorTotalR: prior.totalR,
    deltaR: current.totalR - prior.totalR,
    priorCount: prior.total,
  };
}
