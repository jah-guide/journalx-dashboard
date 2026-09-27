import { trades } from "@/lib/trades";

export function topSetups(limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const trade of trades) {
    counts.set(trade.setup, (counts.get(trade.setup) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}
