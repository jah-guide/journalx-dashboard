import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ImagePlus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { QuickFilterChips } from "@/components/QuickFilterChips";
import { Panel, PageHeader, SectionTitle, formInputClass, formLabelClass } from "@/components/ui-kit";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { usePersistedMarkups } from "@/hooks/use-persisted-markups";
import { markups as seededMarkups, type Markup } from "@/lib/journal";
import { clearStoredMarkups } from "@/lib/sample-storage";
import { PAIRS } from "@/lib/trades";

export const Route = createFileRoute("/journal")({ component: JournalPage });

const tags: Markup["tag"][] = ["Premarket", "Session plan", "Observation", "Review"];

function JournalPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [markups, setMarkups] = usePersistedMarkups(seededMarkups);
  const searchRef = useRef<HTMLInputElement>(null);
  const [pair, setPair] = useState(PAIRS[0]!);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<Markup["tag"]>("Premarket");
  const [images, setImages] = useState<string[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pairFilter, setPairFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateBody, setUpdateBody] = useState("");
  const [updateImages, setUpdateImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateInputRef = useRef<HTMLInputElement>(null);
  const todayLabel = new Date(`${today}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const tagChips = useMemo(
    () => [{ id: "all", label: "All types" }, ...tags.map((item) => ({ id: item, label: item }))],
    [],
  );
  const visibleMarkups = useMemo(
    () =>
      markups.filter(
        (markup) =>
          (pairFilter === "all" || markup.pair === pairFilter) &&
          (dateFilter === "" || markup.date === dateFilter) &&
          (tagFilter === "all" || markup.tag === tagFilter) &&
          `${markup.pair} ${markup.title} ${markup.body}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [markups, pairFilter, dateFilter, tagFilter, query],
  );
  const daysWithMarkups = useMemo(() => new Set(markups.map((markup) => markup.date)), [markups]);

  const addImages = (files: FileList | null) => {
    if (files) setImages((current) => [...current, ...Array.from(files).map((file) => URL.createObjectURL(file))]);
  };

  const saveMarkup = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setMarkups((current) => [{ id: `M-${String(current.length + 25).padStart(3, "0")}`, date: today, pair, title: title.trim(), body: body.trim(), tag, images }, ...current]);
    setTitle(""); setBody(""); setImages([]); setTag("Premarket");
    setComposerOpen(false);
  };

  const cancelUpdate = () => {
    setUpdatingId(null);
    setUpdateBody("");
    setUpdateImages([]);
  };

  const saveUpdate = (markupId: string) => {
    if (!updateBody.trim() && updateImages.length === 0) return;
    setMarkups((current) =>
      current.map((markup) =>
        markup.id === markupId
          ? {
              ...markup,
              updates: [
                ...(markup.updates ?? []),
                {
                  id: `U-${Date.now()}`,
                  body: updateBody.trim(),
                  images: updateImages,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : markup,
      ),
    );
    toast.success("Append saved — original markup unchanged.");
    cancelUpdate();
  };

  useKeyboardShortcuts([
    { key: "/", handler: () => searchRef.current?.focus() },
    { key: "Escape", when: () => updatingId !== null, handler: cancelUpdate },
  ]);

  return <AppShell>
    <PageHeader
      eyebrow={todayLabel}
      title="Journal"
      description="Capture today’s analysis first. Past ideas stay read-only — append updates instead of rewriting history."
    />

    <section>
      <button type="button" onClick={() => setComposerOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl border border-border bg-panel px-5 py-4 text-left transition-all hover:border-primary/50 hover:bg-accent/40">
        <span><span className="block font-medium">New markup</span><span className="mt-1 block text-sm text-muted-foreground">Capture a fresh idea for today.</span></span>
        <span className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{composerOpen ? "Close" : "Create markup"}</span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${composerOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
      <div className="overflow-hidden"><Panel>
      <SectionTitle action={<span className="text-xs text-primary">Today</span>}>New markup</SectionTitle>
      <form onSubmit={saveMarkup} className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label className={formLabelClass} htmlFor="markup-pair">Pair</label><select id="markup-pair" value={pair} onChange={(event) => setPair(event.target.value)} className={formInputClass}>{PAIRS.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div><label className={formLabelClass} htmlFor="markup-tag">Type</label><select id="markup-tag" value={tag} onChange={(event) => setTag(event.target.value as Markup["tag"])} className={formInputClass}>{tags.map((item) => <option key={item}>{item}</option>)}</select></div>
          </div>
          <div><label className={formLabelClass} htmlFor="markup-title">Idea title</label><input id="markup-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Four-hour demand reaction" className={formInputClass} /></div>
          <div><label className={formLabelClass} htmlFor="markup-body">Bias, levels, and invalidation</label><textarea id="markup-body" rows={7} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write your entire idea: higher-timeframe bias, key levels, conditions for entry, and what would invalidate it…" className={`${formInputClass} resize-y`} /></div>
        </div>
        <div className="flex flex-col"><span className={formLabelClass}>Markup charts <span className="normal-case tracking-normal">(optional, multiple)</span></span><input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => addImages(event.target.files)} />{images.length ? <div className="grid grid-cols-2 gap-2">{images.map((image, index) => <div key={image} className="relative"><img src={image} alt={`New markup upload ${index + 1}`} className="aspect-[4/3] w-full rounded-lg border border-border object-cover" /><button type="button" onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove image before saving" className="absolute right-1 top-1 rounded bg-background/80 p-1 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button></div>)}</div> : <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-52 flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-panel/60 px-4 text-center transition-colors hover:border-primary/50"><ImagePlus className="h-6 w-6 text-muted-foreground" /><span className="text-sm">Add markup images</span><span className="text-xs text-muted-foreground">Select as many charts as you need</span></button>}<button type="submit" className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Save today’s markup</button></div>
      </form>
    </Panel></div></div>
    </section>

    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-semibold">Previous markups</h2><p className="mt-1 text-sm text-muted-foreground">A permanent record of your ideas and analysis.</p></div><span className="text-xs text-muted-foreground">{visibleMarkups.length} saved</span></div>
      <Panel>
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">Markup type</p>
          <QuickFilterChips chips={tagChips} activeId={tagFilter} onSelect={setTagFilter} ariaLabel="Filter by markup type" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ideas, bias, or levels… (/ to focus)" aria-label="Search markups" className={`${formInputClass} pl-9`} /></div>
          <select value={pairFilter} onChange={(event) => setPairFilter(event.target.value)} aria-label="Filter markups by pair" className={formInputClass}><option value="all">All pairs</option>{PAIRS.map((item) => <option key={item}>{item}</option>)}</select>
          <button type="button" onClick={() => { setQuery(""); setPairFilter("all"); setDateFilter(""); setTagFilter("all"); }} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Clear filters</button>
        </div>
        <div className="mt-6 space-y-4">
          {visibleMarkups.length ? visibleMarkups.map((markup) => <article key={markup.id} className="rounded-xl border border-border/80 bg-panel/50 p-5 shadow-sm transition-colors hover:border-border"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{markup.pair} <span className="font-normal text-muted-foreground">— {markup.title}</span></p><p className="mt-1 text-xs text-muted-foreground">{new Date(`${markup.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {markup.tag}</p></div><button type="button" onClick={() => setUpdatingId(updatingId === markup.id ? null : markup.id)} className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">Add update</button></div><p className="mt-3 text-sm leading-relaxed text-foreground/90">{markup.body}</p>{markup.images.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{markup.images.map((image, index) => <img key={`${markup.id}-${index}`} src={image} alt={`${markup.pair} markup ${index + 1}`} className="aspect-[4/3] w-full rounded-lg border border-border object-cover" />)}</div> : null}{markup.updates?.map((update) => <div key={update.id} className="mt-4 border-t border-border pt-4"><p className="text-xs uppercase tracking-widest text-primary">Update</p><p className="mt-2 text-sm">{update.body}</p>{update.images.length ? <div className="mt-3 grid grid-cols-2 gap-2">{update.images.map((image) => <img key={image} src={image} alt="Markup update" className="aspect-[4/3] rounded-lg border border-border object-cover" />)}</div> : null}</div>)}{updatingId === markup.id ? <div className="mt-4 border-t border-border pt-4"><textarea value={updateBody} onChange={(event) => setUpdateBody(event.target.value)} rows={3} placeholder="Add an observation or update…" className={`${formInputClass} resize-y`} /><input ref={updateInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => event.target.files && setUpdateImages(Array.from(event.target.files).map((file) => URL.createObjectURL(file)))} /><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => updateInputRef.current?.click()} className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-accent">Add charts</button><button type="button" onClick={() => saveUpdate(markup.id)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Save update</button></div>{updateImages.length ? <p className="mt-2 text-xs text-muted-foreground">{updateImages.length} new chart{updateImages.length === 1 ? "" : "s"} attached</p> : null}</div> : null}</article>) : <p className="py-10 text-center text-sm text-muted-foreground">No saved markups match these filters.</p>}
        </div>
      </Panel>
    </section>

    <details className="mt-6 rounded-xl border border-border bg-panel/40 p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Browse markups by date</span><ChevronDown className="h-4 w-4 text-muted-foreground" /></summary>
      <div className="mt-5"><div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day} className="py-2">{day}</span>)}</div><div className="grid grid-cols-7 gap-1">{Array.from({ length: 6 }).map((_, index) => <div key={`blank-${index}`} />)}{Array.from({ length: 31 }, (_, index) => { const day = index + 1; const date = `2026-08-${String(day).padStart(2, "0")}`; const active = date === dateFilter; return <button key={date} type="button" onClick={() => setDateFilter(active ? "" : date)} className={`relative aspect-square rounded-lg border text-sm transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-transparent hover:bg-accent"}`}><span>{day}</span>{daysWithMarkups.has(date) ? <span className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" /> : null}</button>; })}</div></div>
    </details>
  </AppShell>;
}
