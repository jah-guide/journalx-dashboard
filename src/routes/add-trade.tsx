import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, formInputClass, formLabelClass } from "@/components/ui-kit";
import { topSetups } from "@/lib/setup-suggestions";
import { OUTCOMES, PAIRS, SESSIONS, type Outcome, type Session } from "@/lib/trades";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/add-trade")({ component: AddTrade });

function AddTrade() {
  const [pair, setPair] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [tradeDate, setTradeDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [session, setSession] = useState<Session | "">("");
  const [setup, setSetup] = useState("");
  const [plannedReward, setPlannedReward] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [outcome, setOutcome] = useState<Outcome | "">("");
  const [achievedReward, setAchievedReward] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [beforeShot, setBeforeShot] = useState<string | null>(null);
  const [afterShot, setAfterShot] = useState<string | null>(null);
  const beforeFileRef = useRef<HTMLInputElement>(null);
  const afterFileRef = useRef<HTMLInputElement>(null);
  const pairPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!pairPickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const matches = useMemo(
    () => PAIRS.filter((candidate) => candidate.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const pickImage = (file: File | undefined, setImage: (value: string) => void) => {
    if (file) setImage(URL.createObjectURL(file));
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pair || !tradeDate || !session || !plannedReward) {
      toast.error("Pair, date, session and planned risk-to-reward are required.");
      return;
    }
    if (outcome && !achievedReward) {
      toast.error("Add the achieved reward before saving a completed trade.");
      return;
    }
    toast.success(outcome ? `${pair} completed and ready for review.` : `${pair} saved as a pending trade.`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Add trade"
        description="Capture the plan first, then return to record outcome and achieved R. No money fields — risk multiples only."
      />

      <form onSubmit={save} className="max-w-5xl space-y-6">
        <Panel>
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">1</span>
            <div><h2 className="font-medium">Before the trade</h2><p className="text-xs text-muted-foreground">Your idea, risk-to-reward, and chart before entry.</p></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,280px)]">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={formLabelClass} htmlFor="pair">Trading pair</label>
                  <div ref={pairPickerRef} className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="pair" className={cn(formInputClass, "pl-9")} placeholder="Search pairs…" value={pair || query} onFocus={() => setOpen(true)} onChange={(e) => { setQuery(e.target.value); setPair(""); setOpen(true); }} autoComplete="off" />
                    {pair ? <button type="button" aria-label="Clear pair" onClick={() => { setPair(""); setQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button> : null}
                    {open && !pair ? <ul className="absolute z-10 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-xl">{matches.length ? matches.map((candidate) => <li key={candidate}><button type="button" onClick={() => { setPair(candidate); setQuery(""); setOpen(false); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent">{candidate}</button></li>) : <li className="px-3 py-2 text-sm text-muted-foreground">No pairs found</li>}</ul> : null}
                  </div>
                </div>
                <div><label className={formLabelClass} htmlFor="trade-date">Entry date & time</label><input id="trade-date" type="datetime-local" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} className={formInputClass} /></div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div><span className={formLabelClass}>Session</span><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{SESSIONS.map((item) => <Choice key={item} active={session === item} onClick={() => setSession(item)}>{item}</Choice>)}</div></div>
                <div><label className={formLabelClass} htmlFor="planned-reward">Planned risk-to-reward</label><input id="planned-reward" placeholder="e.g. 1:3" value={plannedReward} onChange={(e) => setPlannedReward(e.target.value)} className={formInputClass} /><p className="mt-2 text-xs text-muted-foreground">The reward you planned relative to one unit of risk.</p></div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={formLabelClass} htmlFor="setup">Setup / tag <span className="normal-case tracking-normal">(optional)</span></label>
                  <input id="setup" placeholder="Liquidity sweep, order block…" value={setup} onChange={(e) => setSetup(e.target.value)} className={formInputClass} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topSetups().map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSetup(name)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground",
                          setup === name && "border-primary bg-primary/10 text-primary",
                        )}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Quick picks from sample history — free text still allowed.</p>
                </div>
              </div>
              <div><label className={formLabelClass} htmlFor="plan-notes">Trade thesis <span className="normal-case tracking-normal">(optional)</span></label><textarea id="plan-notes" rows={4} placeholder="What has to happen for this trade to be valid?" value={planNotes} onChange={(e) => setPlanNotes(e.target.value)} className={cn(formInputClass, "resize-y")} /></div>
            </div>
            <ImageUpload label="Before chart" helper="Optional chart at entry or pending order" image={beforeShot} inputRef={beforeFileRef} onPick={(file) => pickImage(file, setBeforeShot)} onRemove={() => setBeforeShot(null)} />
          </div>
        </Panel>

        <Panel>
          <div className="mb-6 flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">2</span><div><h2 className="font-medium">After the trade</h2><p className="text-xs text-muted-foreground">Optional while the trade is still pending. Complete it once you have an outcome.</p></div></div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,280px)]">
            <div className="space-y-6"><div><span className={formLabelClass}>Outcome</span><div className="grid max-w-md grid-cols-2 gap-2 sm:grid-cols-3">{OUTCOMES.map((item) => <Choice key={item} active={outcome === item} tone={item === "Win" ? "win" : item === "Loss" ? "loss" : "neutral"} onClick={() => setOutcome(item)}>{item}</Choice>)}</div></div>
              <div><label className={formLabelClass} htmlFor="achieved-reward">Achieved reward <span className="normal-case tracking-normal">(R)</span></label><input id="achieved-reward" type="number" step="0.1" inputMode="decimal" placeholder="e.g. 2.4, -1, or 0" value={achievedReward} onChange={(e) => setAchievedReward(e.target.value)} className={cn(formInputClass, "max-w-md num")} /><p className="mt-2 text-xs text-muted-foreground">Your actual result relative to one unit of risk. No money is tracked.</p></div>
              <div><label className={formLabelClass} htmlFor="review-notes">Trade review <span className="normal-case tracking-normal">(optional)</span></label><textarea id="review-notes" rows={4} placeholder="What happened? Did you follow your plan?" value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} className={cn(formInputClass, "resize-y")} /></div>
            </div>
            <ImageUpload label="After chart" helper="Optional chart after exit" image={afterShot} inputRef={afterFileRef} onPick={(file) => pickImage(file, setAfterShot)} onRemove={() => setAfterShot(null)} />
          </div>
        </Panel>

        <button type="submit" className="flex w-full max-w-md items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_32px_-12px_var(--color-primary)] transition-opacity hover:opacity-90"><Check className="h-4 w-4" /> {outcome ? "Save completed trade" : "Save as pending trade"}</button>
      </form>
    </AppShell>
  );
}

function ImageUpload({ label, helper, image, inputRef, onPick, onRemove }: { label: string; helper: string; image: string | null; inputRef: React.RefObject<HTMLInputElement | null>; onPick: (file: File | undefined) => void; onRemove: () => void }) {
  return <div><span className={formLabelClass}>{label}</span><input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />{image ? <div className="space-y-3"><img src={image} alt={`${label} preview`} className="aspect-[4/3] w-full rounded-xl border border-border object-cover" /><button type="button" onClick={onRemove} className="text-xs text-muted-foreground hover:text-foreground">Remove image</button></div> : <button type="button" onClick={() => inputRef.current?.click()} className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-panel/60 px-4 text-center transition-colors hover:border-primary/50"><ImagePlus className="h-6 w-6 text-muted-foreground" /><span className="text-sm">Drop or select an image</span><span className="text-xs text-muted-foreground">{helper}</span></button>}</div>;
}

function Choice({ active, onClick, children, tone = "primary" }: { active: boolean; onClick: () => void; children: React.ReactNode; tone?: "primary" | "win" | "loss" | "neutral" }) {
  return <button type="button" onClick={onClick} className={cn("rounded-lg border border-border bg-panel px-2 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", active && tone === "loss" && "border-loss/50 bg-loss/10 text-loss", active && tone === "neutral" && "border-foreground/20 bg-muted text-foreground", active && (tone === "primary" || tone === "win") && "border-primary/50 bg-primary/10 text-primary")}>{children}</button>;
}
