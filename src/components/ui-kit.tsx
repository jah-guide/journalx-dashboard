import { cn } from "@/lib/utils";
import { fmtR, type Outcome } from "@/lib/trades";
import type { ReactNode } from "react";

export const formInputClass =
  "w-full rounded-lg border border-input bg-panel px-3 py-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

export const formLabelClass = "label-caps mb-2 block";

export function Panel({
  className,
  children,
  variant = "elevated",
}: {
  className?: string;
  children: ReactNode;
  variant?: "elevated" | "flat";
}) {
  return (
    <div className={cn(variant === "flat" ? "panel-flat p-5" : "panel p-5", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-sm font-medium text-primary/90">{eyebrow}</p> : null}
        <h1 className={cn("text-2xl font-semibold sm:text-3xl", eyebrow && "mt-1")}>{title}</h1>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 border-b border-border/60 pb-3">
      <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <Panel className="relative overflow-hidden">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent",
          tone === "positive" && "via-win/50",
          tone === "negative" && "via-loss/50",
        )}
      />
      <p className="label-caps">{label}</p>
      <p
        className={cn(
          "num mt-3 text-3xl font-semibold tracking-tight",
          tone === "positive" && "text-win",
          tone === "negative" && "text-loss",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </Panel>
  );
}

export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        outcome === "Win" && "border-win/35 bg-win/12 text-win",
        outcome === "Loss" && "border-loss/35 bg-loss/12 text-loss",
        outcome === "Breakeven" && "border-border bg-muted/80 text-muted-foreground",
      )}
    >
      {outcome}
    </span>
  );
}

export function RValue({ r, className }: { r: number; className?: string }) {
  return (
    <span
      className={cn(
        "num font-medium",
        r > 0 ? "text-win" : r < 0 ? "text-loss" : "text-muted-foreground",
        className,
      )}
    >
      {fmtR(r)}
    </span>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "win" }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-muted/80">
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "win" ? "bg-win/80" : "bg-primary/90",
        )}
        style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function StatRow({
  name,
  totalR,
  winRate,
  total,
}: {
  name: string;
  totalR: number;
  winRate: number;
  total: number;
}) {
  return (
    <li>
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">{name}</span>
        <RValue r={totalR} />
      </div>
      <Bar value={winRate} tone={totalR >= 0 ? "win" : "primary"} />
      <p className="mt-1.5 text-xs text-muted-foreground">
        {winRate.toFixed(0)}% win · {total} trades
      </p>
    </li>
  );
}
