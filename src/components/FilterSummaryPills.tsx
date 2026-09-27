import type { TradeFilters } from "@/lib/filter-trades";

const labels: Partial<Record<keyof TradeFilters, string>> = {
  q: "Search",
  pair: "Pair",
  session: "Session",
  outcome: "Outcome",
  setup: "Setup",
  review: "Review",
  plan: "Plan",
  from: "From",
  to: "To",
};

export function FilterSummaryPills({ filters }: { filters: TradeFilters }) {
  const active = (Object.keys(labels) as (keyof TradeFilters)[])
    .map((key) => {
      const value = filters[key];
      if (value === "" || value === "all") return null;
      return { key, label: labels[key]!, value: String(value) };
    })
    .filter(Boolean) as { key: keyof TradeFilters; label: string; value: string }[];

  if (!active.length) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Active filters">
      {active.map((item) => (
        <span
          key={item.key}
          className="rounded-full border border-border bg-panel/60 px-2.5 py-0.5 text-[11px] text-muted-foreground"
        >
          {item.label}: <span className="font-medium text-foreground">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
