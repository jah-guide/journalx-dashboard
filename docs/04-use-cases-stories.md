# Use cases and user stories — JournalX

Trader journeys with acceptance criteria linked to requirement IDs.

---

## UC-01 — Review performance at a glance

**Actor:** Trader · **Pre:** At least one trade in the dataset

1. Open Dashboard → pick period (7 / 30 / all).
2. System shows R-only totals, cumulative chart, session/pair breakdown, recent trades.

**Post:** No money fields anywhere.

**Maps to:** FR-001–FR-004

### US-01

**As a** trader, **I want** a period-filtered dashboard **so that** I see recent process in R terms.

- Totals and win rate use only the selected window.
- Changing period updates chart and breakdowns without a full reload.
- No dollar or balance figures on the dashboard.

---

## UC-02 — Capture pre-session analysis (markup)

**Actor:** Trader · **Pre:** On Journal route

1. Open “New markup” for today → pair, tag, title, body, optional images → save.
2. **Alt:** Filter or search past markups.

**Maps to:** FR-010, FR-011, FR-013

### US-02

**As a** trader, **I want** pair-specific analysis **so that** I trade from a written plan.

- Save with title + body → new markup at top with today’s date.
- Multiple images all display on the saved markup.
- Search filters the list to matching bodies/titles.

---

## UC-03 — Append journal update (accountability)

**Actor:** Trader · **Pre:** Saved markup exists

1. “Add update” → observation and/or charts → append block; original body unchanged.

**Maps to:** FR-012, NFR-003, BR-03

### US-03

**As a** trader, **I want** follow-up notes without rewriting the original **so that** the journal stays honest.

- Original body stays visible and unchanged after an update.
- Updates show with an “Update” label and timestamp after original content.
- No “Edit” or “Delete” for historical markups.

---

## UC-04 — Plan a trade (pending)

**Actor:** Trader · **Pre:** On Add trade

1. Fill before-trade section (pair, session, planned R:R, …).
2. Leave outcome empty → save as pending.

**Maps to:** FR-020, FR-021, FR-023, FR-024

### US-04

**As a** trader, **I want** to save my plan before entry **so that** review compares intent to result.

- Plan fields present, outcome empty → pending save (no achieved R).
- Missing planned R:R → blocked with error.
- No monetary fields on the form.

---

## UC-05 — Complete a trade (review)

**Actor:** Trader · **Pre:** Plan captured

1. Set outcome and achieved R → optional review notes and after chart → save completed.

**Maps to:** FR-022, FR-023, BR-02

### US-05

**As a** trader, **I want** achieved R separate from planned target **so that** I measure execution quality.

- Outcome set but achieved R empty → save blocked.
- Win at +2.4R included in average achieved R in analytics.
- Planned R:R visible next to achieved R in history detail.

---

## UC-06 — Find and inspect past trades

**Actor:** Trader

1. Trade history → filters (pair, session, setup, dates, review status) → open row for detail.

**Maps to:** FR-030–FR-032

### US-06

**As a** trader, **I want** strong filters **so that** I can review one setup or session in isolation.

- London-only filter → every row is London; summary stats match.
- Open by id/search → plan, review notes, and both screenshots (if any) show.

---

## UC-07 — Analyze planned vs achieved

**Actor:** Trader

1. Analytics → plan adherence, average planned reward, average achieved R, breakdowns, cumulative curve.

**Maps to:** FR-040–FR-044

### US-07

**As a** trader, **I want** planned vs achieved comparison **so that** ambitious targets aren’t confused with results.

- Both “Planned reward” (R:R aggregate) and “Achieved reward” (average R) on the page.
- Breakdown tables for pair, session, and setup.
- Small-sample guidance when trade count is below threshold (prototype should-level).

---

## Related documents

- [03-requirements.md](./03-requirements.md)
- [07-sequence-flows.md](./07-sequence-flows.md)
- [09-acceptance-tests.md](./09-acceptance-tests.md)
