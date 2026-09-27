import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function EquityChart({
  data,
  height = 260,
}: {
  data: { label: string; date: string; r: number }[];
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="rFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
              <stop offset="85%" stopColor="var(--color-primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeOpacity={0.6} vertical={false} />
          <ReferenceLine y={0} stroke="var(--color-muted-foreground)" strokeOpacity={0.35} strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => `${v}R`}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-primary)", strokeOpacity: 0.25, strokeWidth: 1 }}
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 10,
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              color: "var(--color-foreground)",
              boxShadow: "0 12px 40px -20px oklch(0 0 0 / 0.8)",
            }}
            labelFormatter={(_l, p) => p?.[0]?.payload?.date ?? ""}
            formatter={(v: number | string) => [`${v}R`, "Cumulative"]}
          />
          <Area
            type="monotone"
            dataKey="r"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#rFill)"
            activeDot={{ r: 4, fill: "var(--color-primary)", stroke: "var(--color-background)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
