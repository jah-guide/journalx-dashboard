import { cn } from "@/lib/utils";

export type QuickChip = {
  id: string;
  label: string;
  title?: string;
};

export function QuickFilterChips({
  chips,
  activeId,
  onSelect,
  ariaLabel = "Quick filters",
}: {
  chips: QuickChip[];
  activeId: string;
  onSelect: (id: string) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      role="group"
      aria-label={ariaLabel}
    >
      {chips.map((chip) => {
        const active = chip.id === activeId;
        return (
          <button
            key={chip.id}
            type="button"
            title={chip.title ?? chip.label}
            aria-pressed={active}
            onClick={() => onSelect(active ? "all" : chip.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
