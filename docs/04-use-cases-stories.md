# Use cases and user stories — JournalX

## Purpose of this document

Express trader journeys as use cases and user stories with **acceptance criteria** tied to requirement IDs.

---

## UC-01 — Review performance at a glance

**Actor:** Trader  
**Precondition:** At least one trade exists in the dataset  
**Main flow:**

1. Trader opens Dashboard.
2. Trader selects period (7 / 30 / all).
3. System recalculates totals, cumulative chart, session/pair breakdown, recent trades.

**Postcondition:** Trader sees R-based metrics only (no money).

**Maps to:** FR-001, FR-002, FR-003, FR-004

### User story US-01

**As a** trader, **I want** a period-filtered dashboard **so that** I can see whether my recent process is working in R terms.

**Acceptance criteria:**

- Given trades in the selected window, when I view the dashboard, then total R and win rate reflect only that window.
- When I change the period, then cumulative R chart and breakdowns update without a full page reload beyond normal SPA navigation.
- No dollar or balance figures appear anywhere on the dashboard.

---

## UC-02 — Capture pre-session analysis (markup)

**Actor:** Trader  
**Precondition:** User is on Journal route  
**Main flow:**

1. Trader opens “New markup” for today.
2. Trader selects pair, tag, title, body, optional images.
3. Trader saves; markup appears in history.

**Alternate:** Trader filters or searches past markups by pair or keyword.

**Maps to:** FR-010, FR-011, FR-013

### User story US-02

**As a** trader, **I want** to write today’s pair-specific analysis **so that** I trade from a written plan, not memory.

**Acceptance criteria:**

- Given title and body are filled, when I save, then a new markup appears at the top of the list with today’s date.
- Given I upload multiple images, when I save, then all images display on the saved markup.
- Given I search by a word in the body, when results load, then only matching markups show.

---

## UC-03 — Append journal update (accountability)

**Actor:** Trader  
**Precondition:** A saved markup exists  
**Main flow:**

1. Trader clicks “Add update” on a markup.
2. Trader enters observation text and/or charts.
3. System appends an update block; original markup body unchanged.

**Maps to:** FR-012, NFR-003, BR-03

### User story US-03

**As a** trader, **I want** to add follow-up notes without rewriting my original idea **so that** my journal stays honest over time.

**Acceptance criteria:**

- Given a saved markup, when I append an update, then the original body text remains visible and unchanged.
- When I save an update, then it shows with an “Update” label and timestamp ordering after the original content.
- The UI does not offer “Edit markup” or “Delete markup” for historical entries.

---

## UC-04 — Plan a trade (pending)

**Actor:** Trader  
**Precondition:** User on Add trade  
**Main flow:**

1. Trader completes before-trade section (pair, session, planned R:R, etc.).
2. Trader leaves outcome empty.
3. Trader saves as pending.

**Maps to:** FR-020, FR-021, FR-023, FR-024

### User story US-04

**As a** trader, **I want** to save my plan before entry **so that** later review compares intent to result.

**Acceptance criteria:**

- Given required plan fields are present and outcome is empty, when I submit, then I receive confirmation of a pending trade (no achieved R required).
- Given I omit planned R:R, when I submit, then the system blocks save with an error message.
- No monetary fields are present on the form.

---

## UC-05 — Complete a trade (review)

**Actor:** Trader  
**Precondition:** Plan captured (same session or later)  
**Main flow:**

1. Trader sets outcome and achieved R.
2. Trader adds optional review notes and after chart.
3. Trader saves completed trade.

**Maps to:** FR-022, FR-023, BR-02

### User story US-05

**As a** trader, **I want** to log achieved R separately from my planned target **so that** I measure execution quality.

**Acceptance criteria:**

- Given outcome is selected, when achieved R is empty and I submit, then save is blocked with an error.
- Given outcome Win and achieved R +2.4, when saved, then analytics can include that value in average achieved R.
- Planned R:R remains visible alongside achieved R in history detail.

---

## UC-06 — Find and inspect past trades

**Actor:** Trader  
**Main flow:**

1. Trader opens Trade history.
2. Trader applies filters (pair, session, setup, dates, review status).
3. Trader opens a trade row for detail (notes, charts).

**Maps to:** FR-030, FR-031, FR-032

### User story US-06

**As a** trader, **I want** powerful filters **so that** I can review one setup or session in isolation.

**Acceptance criteria:**

- When I filter to London session only, then every row shows session London and summary stats match the filter.
- When I open a trade by id/search param, then plan and review notes and both screenshots (if any) display.

---

## UC-07 — Analyze planned vs achieved

**Actor:** Trader  
**Main flow:**

1. Trader opens Analytics.
2. System shows plan adherence, average planned reward, average achieved R, breakdowns, cumulative curve.

**Maps to:** FR-040, FR-041, FR-042, FR-043, FR-044

### User story US-07

**As a** trader, **I want** planned vs achieved comparison **so that** I don’t confuse ambitious targets with actual results.

**Acceptance criteria:**

- Analytics page displays both “Planned reward” (R:R aggregate) and “Achieved reward” (average R).
- Breakdown tables exist for pair, session, and setup.
- Small-sample guidance appears when trade count is below threshold (should-level in prototype).

---

## Related documents

- [03-requirements.md](./03-requirements.md)
- [07-sequence-flows.md](./07-sequence-flows.md)
- [09-acceptance-tests.md](./09-acceptance-tests.md)
