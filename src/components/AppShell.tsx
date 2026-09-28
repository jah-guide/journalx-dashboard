import { Link } from "@tanstack/react-router";
import { LayoutDashboard, PlusCircle, History, BarChart3, NotebookPen } from "lucide-react";
import type { ReactNode } from "react";
import { JournalMark } from "@/components/journal-mark";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", mobileLabel: "Home", icon: LayoutDashboard },
  { to: "/journal", label: "Journal", mobileLabel: "Journal", icon: NotebookPen },
  { to: "/add-trade", label: "Add Trade", mobileLabel: "Add", icon: PlusCircle },
  { to: "/history", label: "History", mobileLabel: "History", icon: History },
  { to: "/analytics", label: "Analytics", mobileLabel: "Stats", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip md:flex">
      <aside className="hidden w-60 shrink-0 flex-col gap-8 border-r border-border/80 bg-card/30 p-5 backdrop-blur-sm md:flex lg:w-64 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <Brand />
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors",
                "hover:bg-accent/80 hover:text-foreground",
                "data-[status=active]:bg-accent data-[status=active]:text-foreground",
              )}
            >
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity group-data-[status=active]:opacity-100" />
              <Icon className="h-4 w-4 shrink-0 opacity-70 group-data-[status=active]:text-primary group-data-[status=active]:opacity-100" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <KeyboardShortcutsDialog />
          <div className="rounded-lg border border-border/60 bg-panel/50 px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Prototype
            </p>
            <p className="mt-1 text-xs text-muted-foreground/90">
              Sample trades · markups persist locally
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/80 bg-card/90 px-4 py-3 backdrop-blur-md supports-[padding:max(0px)]:pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
          <Brand compact />
          <ThemeToggle />
        </header>
        <main
          className={cn(
            "min-w-0 flex-1 px-4 pb-[max(6.5rem,env(safe-area-inset-bottom)+5.5rem)] pt-5",
            "sm:px-5 md:mx-auto md:max-w-6xl md:px-8 md:pb-10 md:pt-8 lg:px-10 lg:pt-10",
          )}
        >
          {children}
        </main>
      </div>

      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border/80 bg-card/95 backdrop-blur-md",
          "pb-[max(0.35rem,env(safe-area-inset-bottom))] md:hidden",
        )}
      >
        {nav.map(({ to, label, mobileLabel, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-[10px] font-medium leading-tight text-muted-foreground data-[status=active]:text-primary"
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="max-w-full truncate">{mobileLabel}</span>
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/15 p-1.5 text-primary shadow-[0_0_24px_-8px_var(--color-primary)]">
        <JournalMark />
      </span>
      {!compact ? (
        <div className="min-w-0">
          <span className="block font-display text-lg font-semibold tracking-tight">JournalX</span>
          <span className="block text-[11px] text-muted-foreground">Trading journal</span>
        </div>
      ) : (
        <span className="truncate font-display text-lg font-semibold tracking-tight">JournalX</span>
      )}
    </Link>
  );
}
