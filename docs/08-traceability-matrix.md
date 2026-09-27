# Traceability matrix — JournalX

## Purpose of this document

Map **requirements** → **design artifacts** → **prototype location** → **acceptance tests** for portfolio and future backend work.

Legend: ✅ implemented in demo · ⚠ partial · ○ not yet (documented gap)

---

## Functional requirements

| Req ID | Use case / story | Design artifact | Implementation (v0) | Test ID |
|--------|------------------|-----------------|---------------------|---------|
| FR-001 | UC-01, US-01 | 05 to-be Learn | `src/routes/index.tsx`, `stats()` | AT-001 |
| FR-002 | UC-01 | 07 SF-04 | `EquityChart`, `cumulative()` | AT-002 |
| FR-003 | UC-01 | 06 ERD | `groupBy("session"\|"pair")` on dashboard | AT-003 |
| FR-004 | UC-01 | — | Recent trades list on dashboard | AT-004 |
| FR-005 | UC-01 | — | `period-compare.ts`, `PeriodDeltaBadge` | AT-005 |
| FR-014 | UC-02 | 06 Markup | `sample-storage.ts`, `usePersistedMarkups` | AT-014 |
| FR-015 | UC-02 | — | Tag chips, reset sample markups | AT-016 |
| FR-033 | UC-06 | — | `export-trades.ts`, history export | AT-033 |
| FR-034 | UC-06/07 | — | History plan filter + search param | AT-034 |
| FR-035 | UC-06 | — | `QuickFilterChips`, `FilterSummaryPills` | AT-035 |
| FR-036 | UC-06 | — | `EmptyState` | AT-036 |
| FR-037 | UC-06 | — | `CopyTradeLink` | AT-037 |
| FR-045 | UC-01/07 | — | `PlanAdherenceCallout` | AT-006 |
| FR-046 | UC-07 | — | Analytics deviations panel | AT-045 |
| FR-047 | UC-04 | — | `setup-suggestions.ts`, add-trade chips | AT-025 |
| FR-010 | UC-02, US-02 | 06 Markup | `src/routes/journal.tsx` composer | AT-010 |
| FR-011 | UC-02 | 06 Markup | Filters + search in journal | AT-011 |
| FR-012 | UC-03, US-03 | 07 SF-03 | `saveUpdate()` append to `updates[]` | AT-012 |
| FR-013 | UC-02 | 05 Plan subgraph | Today-first header + composer | AT-013 |
| FR-020 | UC-04 | 07 SF-01 | `add-trade.tsx` panel 1 | AT-020 |
| FR-021 | UC-04, US-04 | 07 SF-01 | Pending save path (no outcome) | AT-021 |
| FR-022 | UC-05 | 07 SF-01 | `add-trade.tsx` panel 2 | AT-022 |
| FR-023 | UC-04/05 | 07 SF-01 | `save()` validation + toasts | AT-023 |
| FR-024 | All trade flows | 03 BR-01 | No money inputs in routes | AT-024 |
| FR-030 | UC-06, US-06 | — | `src/routes/history.tsx` filters | AT-030 |
| FR-031 | UC-06 | 06 Trade | Trade detail drawer/panel | AT-031 |
| FR-032 | UC-06 | — | `stats(filtered)` banner | AT-032 |
| FR-040 | UC-07 | — | `src/routes/analytics.tsx` | AT-040 |
| FR-041 | UC-07, US-07 | 05 to-be | Planned vs achieved panels | AT-041 |
| FR-042 | UC-07 | — | `followedPlan` percentage | AT-042 |
| FR-043 | UC-07 | 06 groupBy | Pair/session/setup tables | AT-043 |
| FR-044 | UC-07 | — | Small-sample copy in analytics | AT-044 |
| FR-050 | — | 06 PAIR/SESSION | `PAIRS`, `SESSIONS` in trades.ts | AT-050 |
| FR-051 | — | 06 Setup | Free-text `setup` on Trade | AT-051 |

---

## Non-functional requirements

| Req ID | Verification approach | Implementation | Test ID |
|--------|----------------------|----------------|---------|
| NFR-001 | Manual navigation | `AppShell` nav links | AT-100 |
| NFR-002 | Form submit errors | `add-trade.tsx` toasts | AT-101 |
| NFR-003 | UI inspection | Journal: append only | AT-102 |
| NFR-004 | README + this matrix | Seed trades; markups in localStorage; add-trade no persist | AT-103 |
| NFR-010 | Storage inspection | `journalx:markups:v1` | AT-014 |
| NFR-011 | Keyboard smoke | `use-keyboard-shortcuts`, dialog | AT-108 |
| NFR-005 | Manual smoke | ~24 seed trades | AT-104 |
| NFR-006 | Spot check aria | History filters, pair search | AT-105 |
| NFR-007 | Code review | `src/lib/trades.ts`, `journal.ts` | AT-106 |
| NFR-009 | `npm run dev` | Vite + TanStack Start | AT-107 |

---

## Business rules

| Rule | Requirements | Tests |
|------|--------------|-------|
| BR-01 No money | FR-024 | AT-024 |
| BR-02 Planned vs achieved | FR-041, FR-022 | AT-041, AT-022 |
| BR-03 Append-only journal | FR-012, NFR-003 | AT-012, AT-102 |

---

## Known gaps (honest traceability)

| Item | Status | Planned |
|------|--------|---------|
| Persist new trades from Add trade | ⚠ | Backend / local storage phase |
| Link trade → originating markup | ○ | Roadmap in README |
| Immutable markup across browser refresh | ✅ | Markups persist via localStorage (append-only) |
| Multi-user / auth | ○ | Out of scope v0 |

---

## Related documents

- [03-requirements.md](./03-requirements.md)
- [09-acceptance-tests.md](./09-acceptance-tests.md)
