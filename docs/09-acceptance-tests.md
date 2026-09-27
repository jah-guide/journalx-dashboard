# Acceptance tests — JournalX

## Purpose of this document

Checklist for validating the **working prototype** against requirements. Run manually after `npm install && npm run dev` unless automated tests are added later.

**Environment:** Node LTS, modern Chromium or Firefox, viewport ≥ 1024px recommended.

---

## Dashboard

| ID | Steps | Expected result | Req |
|----|-------|-----------------|-----|
| AT-001 | Open `/`, note total R and win rate; switch period 7 → 30 → all | Figures change with period; only R and counts shown | FR-001 |
| AT-002 | On dashboard, locate cumulative R chart | Chart renders without error for each period | FR-002 |
| AT-003 | Compare session and pair sections | At least one session and top pairs listed with R stats | FR-003 |
| AT-004 | Scroll recent trades | Up to five trades with outcome badges and R values | FR-004 |

---

## Journal (markups)

| ID | Steps | Expected result | Req |
|----|-------|-----------------|-----|
| AT-010 | Open `/journal`, create markup with title + body | New entry appears in list with today’s date | FR-010 |
| AT-011 | Search unique word from body; filter by pair | List narrows correctly; clear filters resets | FR-011 |
| AT-012 | Add update to existing markup | Original body unchanged; update section appears below | FR-012, NFR-003 |
| AT-013 | Land on journal | “Today” emphasis and composer above history | FR-013 |

---

## Add trade

| ID | Steps | Expected result | Req |
|----|-------|-----------------|-----|
| AT-020 | Fill pair, datetime, session, planned R:R, submit without outcome | Success toast for pending trade | FR-020, FR-021 |
| AT-021 | Same as AT-020 | Achieved R not required when outcome empty | FR-021 |
| AT-022 | Set outcome Win and achieved R, submit | Success toast for completed trade | FR-022 |
| AT-023 | Submit with missing planned R:R | Error toast; no success | FR-023 |
| AT-023b | Set outcome without achieved R | Error toast | FR-023 |
| AT-024 | Inspect entire add-trade form | No balance, dollar, lot, or commission fields | FR-024, BR-01 |

---

## Trade history

| ID | Steps | Expected result | Req |
|----|-------|-----------------|-----|
| AT-030 | Filter by London session and a setup from dropdown | All visible rows match filters | FR-030 |
| AT-031 | Open a trade detail (click row / deep link) | Plan notes, review notes, R:R, R, screenshots | FR-031 |
| AT-032 | Apply filter and read summary strip | Stats reflect filtered subset only | FR-032 |

---

## Analytics

| ID | Steps | Expected result | Req |
|----|-------|-----------------|-----|
| AT-040 | Open `/analytics` | Wins/losses/BE, cumulative R, avg R visible | FR-040 |
| AT-041 | Compare Planned reward vs Achieved reward cards | Both values shown; different semantics (R:R vs R) | FR-041, BR-02 |
| AT-042 | Read plan adherence percentage | Integer % based on followedPlan flags | FR-042 |
| AT-043 | Expand pair, session, setup breakdowns | Tables or bars with win rate and total R | FR-043 |
| AT-044 | With seed data, read small-sample guidance | Caution copy present when implemented (should) | FR-044 |

---

## Reference data

| ID | Steps | Expected result | Req |
|----|-------|-----------------|-----|
| AT-050 | Pair picker on add-trade and journal | Catalog includes EUR/USD, XAU/USD, etc. | FR-050 |
| AT-051 | History setup filter | Distinct setup values from seed trades | FR-051 |

---

## Non-functional

| ID | Steps | Expected result | Req |
|----|-------|-----------------|-----|
| AT-100 | From dashboard, reach journal and add-trade via nav | ≤ 2 clicks each | NFR-001 |
| AT-101 | Trigger validation errors on add-trade | Readable error toasts | NFR-002 |
| AT-102 | Confirm no edit/delete on saved markup body | Only “Add update” offered | NFR-003 |
| AT-103 | Save new trade, refresh page, open history | New trade **not** in list (seed only); documented limitation | NFR-004 |
| AT-104 | Navigate all main routes | No long freezes on seed data | NFR-005 |
| AT-107 | Clone repo, `npm install && npm run dev` | App serves on Vite default port | NFR-009 |

---

## Sign-off template

| Role | Name | Date | Pass / Fail |
|------|------|------|-------------|
| Analyst | | | |
| Trader proxy | | | |

---

## Related documents

- [08-traceability-matrix.md](./08-traceability-matrix.md)
- [03-requirements.md](./03-requirements.md)
