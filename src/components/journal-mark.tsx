import { cn } from "@/lib/utils";

type JournalMarkProps = {
  className?: string;
};

/** JournalX monogram: rounded tile + equity sparkline */
export function JournalMark({ className }: JournalMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-full w-full", className)}
      aria-hidden
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path
        d="M6 21.5 10.5 14 14.5 17.5 18.5 10.5 22 14.5 26 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
