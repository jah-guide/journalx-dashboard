# Requirements — JournalX

## Purpose of this document

Catalogue **functional requirements (FR)** and **non-functional requirements (NFR)** with stable IDs for traceability, test design, and future backend work.

## Functional requirements

### Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | The system shall display aggregate statistics for a selectable period (7 days, 30 days, all): total R, win rate, trade count, and average R. | Must |
| FR-002 | The system shall show cumulative R over time for the selected period. | Must |
| FR-003 | The system shall rank performance by **session** and **pair** (at least top pairs). | Must |
| FR-004 | The system shall list recent trades with pair, outcome, and achieved R. | Must |

### Journal (markups)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-010 | The user shall create a **markup** for today with pair, title, body, tag (Premarket, Session plan, Observation, Review), and optional images. | Must |
| FR-011 | Saved markups shall appear in a searchable, filterable history (by pair, date, text). | Must |
| FR-012 | The user shall **append** an update (text and/or images) to an existing markup; original markup content shall not be editable. | Must |
| FR-013 | The journal view shall emphasize **today-first** composition before browsing history. | Should |

### Trades — plan and execute

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-020 | The user shall record **before-trade** data: pair, datetime, session, planned risk-to-reward, optional setup tag, plan notes, optional before chart. | Must |
| FR-021 | The user may save a trade as **pending** (plan only) without outcome or achieved R. | Must |
| FR-022 | The user shall record **after-trade** data: outcome (Win/Loss/Breakeven), achieved R, review notes, optional after chart. | Must |
| FR-023 | The system shall require pair, date/time, session, and planned R:R before save; if outcome is set, achieved R is required. | Must |
| FR-024 | The system shall **not** provide fields for monetary amount, balance, lot size, or commission. | Must |

### Trade history

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-030 | The user shall search and filter trades by text, pair, session, outcome, setup, date range, and review completeness (before/after charts). | Must |
| FR-031 | The user shall open a trade detail view showing plan notes, review notes, planned R:R, achieved R, and screenshots. | Must |
| FR-032 | Filtered lists shall show summary stats for the current filter set. | Should |

### Analytics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-040 | The system shall report wins, losses, breakevens, cumulative R, and average R per trade. | Must |
| FR-041 | The system shall compare **average planned reward** (from planned R:R) with **average achieved R**. | Must |
| FR-042 | The system shall compute **plan adherence** (% of trades marked as following the plan). | Must |
| FR-043 | The system shall break down results by pair, session, and setup with win rate and total R. | Must |
| FR-044 | The system shall display guidance when sample size is small (low statistical confidence). | Should |

### Reference data

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-050 | The system shall offer a fixed list of trading **pairs** and three **sessions** (Asian, London, New York). | Must |
| FR-051 | **Setup** shall be a free-text tag on trades (not a separate admin entity in v0). | Must |

## Non-functional requirements

| ID | Category | Requirement | Priority |
|----|----------|-------------|----------|
| NFR-001 | Usability | Primary workflows (dashboard, add trade, journal) reachable within two clicks from app shell navigation. | Must |
| NFR-002 | Usability | Forms shall surface validation errors via clear messages (e.g. missing planned R:R). | Must |
| NFR-003 | Integrity | Journal markups and append-only updates shall not expose edit/delete of historical markup body in UI. | Must |
| NFR-004 | Data | v0 prototype may use **seed and session-local data**; production persistence is out of scope until backend phase. | Must (documented) |
| NFR-005 | Performance | Dashboard and history views shall render seed dataset (&lt;100 trades) without perceptible lag on modern desktop browsers. | Should |
| NFR-006 | Accessibility | Interactive controls shall have labels or aria-labels suitable for keyboard navigation. | Should |
| NFR-007 | Maintainability | Domain types (`Trade`, `Markup`, `Session`) shall live in shared modules for future API parity. | Should |
| NFR-008 | Privacy | No third-party analytics requiring PII in the trading journal prototype. | Should |
| NFR-009 | Portability | App shall run locally via `npm install && npm run dev` on Node LTS. | Must |

## Constraints (business rules)

1. **BR-01 — No money fields** — Any field implying currency P&amp;L is excluded.
2. **BR-02 — Planned vs achieved** — `plannedReward` (R:R string) and `r` (achieved R) are stored and displayed separately.
3. **BR-03 — Append-only journal** — Markup `updates[]` grow over time; no in-place mutation of saved markup text in product rules (prototype implements via React state).

## Related documents

- [04-use-cases-stories.md](./04-use-cases-stories.md)
- [08-traceability-matrix.md](./08-traceability-matrix.md)
- [09-acceptance-tests.md](./09-acceptance-tests.md)
