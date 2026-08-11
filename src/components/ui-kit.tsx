import { cn } from "@/lib/utils";
import { fmtR, type Outcome } from "@/lib/trades";
import type { ReactNode } from "react";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("panel p-5", className)}>{children}</div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold">{children}</h2>
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
    <Panel>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p
        className={cn(
          "num mt-3 text-3xl font-semibold",
          tone === "positive" && "text-win",
          tone === "negative" && "text-loss",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Panel>
  );
}

export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        outcome === "Win" && "border-win/30 bg-win/10 text-win",
        outcome === "Loss" && "border-loss/30 bg-loss/10 text-loss",
        outcome === "Breakeven" && "border-border bg-muted text-muted-foreground",
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

export function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
      />
    </div>
  );
}
