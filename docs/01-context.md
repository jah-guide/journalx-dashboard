# Business context — JournalX

## Purpose of this document

Establishes the problem space, product vision, scope boundaries, and assumptions for JournalX so downstream requirements and acceptance tests stay aligned with trader outcomes—not vanity metrics.

## Problem statement

Retail and independent traders often **mix P&amp;L vanity metrics with process review**. Spreadsheets, broker statements, and generic journals emphasize account balance, dollar profit, and win rate without preserving:

- What was planned before entry (thesis, invalidation, target R)
- Whether execution matched the plan
- A durable record of pre-session analysis that cannot be rewritten after the fact

That gap makes it hard to answer: *“Am I improving my process, or just getting lucky on size?”*

## Product vision

**JournalX** is a focused trading journal that measures performance in **R-multiples and risk-to-reward only**—never currency. It separates **planning** (markups, trade thesis, planned R:R) from **execution** (outcome, achieved R, review notes) and treats the journal as an **append-only accountability record**.

## In scope (current prototype)

| Area | Description |
|------|-------------|
| Dashboard | Aggregate R, win rate, session/pair breakdowns, recent trades, period filter |
| Journal | Pair-specific markups with tags, images, search/filter, append-only updates |
| Add trade | Two-stage flow: plan (before) → complete (after) with validation |
| Trade history | Search and multi-filter list with trade detail |
| Analytics | Grouped stats, planned vs achieved R, plan adherence, cumulative R curve |

## Out of scope (explicit non-goals for v0)

- Account balances, lot size, commission, or any monetary P&amp;L
- Multi-user auth, cloud sync, or broker API integration
- Editing or deleting saved markups or historical trade rows (by design)
- Social feed, copy-trading, or signal publishing (Discord integration is roadmap only)

## Assumptions

1. **Single trader persona** — one user reviewing their own process (demo uses sample data for “Alex”).
2. **R is the unit of account** — one R equals one predefined risk unit per trade; the app does not calculate position size.
3. **Sessions are discrete** — Asian, London, New York (aligned with common FX/index session labels).
4. **Prototype validation** — the React/Vite frontend proves UX and rules; persistence is a future backend concern.

## Success measures (product, not vanity)

- Traders can log a **plan before** entry and a **review after** exit on the same record.
- Analytics compare **planned reward** (e.g. 1:3) with **achieved R** (+2.4R, −1R, 0).
- Journal markups remain **immutable**; only **append** updates are allowed.
- No UI field collects dollar amounts or account equity.

## References

- Working demo: repository root `README.md`
- Requirements: [03-requirements.md](./03-requirements.md)
- Process change: [05-process-as-is-to-be.md](./05-process-as-is-to-be.md)
