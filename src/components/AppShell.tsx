import { Link } from "@tanstack/react-router";
import { LayoutDashboard, PlusCircle, History, BarChart3, NotebookPen } from "lucide-react";
import type { ReactNode } from "react";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/add-trade", label: "Add Trade", icon: PlusCircle },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/80 bg-card/30 p-6 gap-8 backdrop-blur-sm">
        <Brand />
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
        <header className="flex items-center justify-between border-b border-border/80 px-5 py-4 lg:hidden">
          <Brand compact />
        </header>
        <main className="min-w-0 flex-1 px-5 pb-28 pt-6 lg:mx-auto lg:max-w-6xl lg:px-10 lg:pb-14 lg:pt-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border/80 bg-card/95 backdrop-blur-md lg:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground data-[status=active]:text-primary"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/15 font-display text-sm font-bold text-primary shadow-[0_0_24px_-8px_var(--color-primary)]">
        JX
      </span>
      {!compact ? (
        <div>
          <span className="block font-display text-lg font-semibold tracking-tight">JournalX</span>
          <span className="block text-[11px] text-muted-foreground">Trading journal</span>
        </div>
      ) : (
        <span className="font-display text-lg font-semibold tracking-tight">JournalX</span>
      )}
    </Link>
  );
}
