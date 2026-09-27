import { useEffect, useState } from "react";
import { Keyboard } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

const rows = [
  { keys: "?", action: "Show keyboard shortcuts" },
  { keys: "/", action: "Focus search (history & journal)" },
  { keys: "Esc", action: "Close trade detail or cancel append" },
  { keys: "Ctrl+E", action: "Export filtered trades as JSON (history)" },
];

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts([
    { key: "?", shift: true, handler: () => setOpen((value) => !value) },
    { key: "Escape", when: () => open, handler: () => setOpen(false) },
  ]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:inline-flex"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="h-3.5 w-3.5" />
        Shortcuts
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="shortcuts-title" className="text-lg font-semibold">
              Keyboard shortcuts
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">R-only fields — export never includes currency.</p>
            <ul className="mt-5 space-y-3">
              {rows.map((row) => (
                <li key={row.keys} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{row.action}</span>
                  <kbd className="num rounded-md border border-border bg-panel px-2 py-0.5 text-xs font-medium">
                    {row.keys}
                  </kbd>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
