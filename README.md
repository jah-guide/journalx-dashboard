# JournalX — product analysis & trading journal prototype

**Live demo:** [jah-guide.github.io/journalx-dashboard](https://jah-guide.github.io/journalx-dashboard/)

**Portfolio context:** Systems Analyst showcase for [jah-guide](https://github.com/jah-guide) — requirements and traceability first, then a runnable UI that validates the rules.

## Problem

Traders often **mix P&amp;L vanity metrics with process review**. Dollar balances and win-rate screenshots replace a durable record of what was planned, what was executed, and what was learned. Plans get rewritten after the fact; pre-session chart markup is lost; “edge” by session or setup never surfaces.

JournalX addresses the **process gap**, not broker execution.

## Stakeholders and outcomes

| Stakeholder | Outcome |
|-------------|---------|
| Independent trader | Plan in R, log results in R, review without currency noise |
| Analyst / owner | End-to-end spec pack with traceability to the demo |
| Future engineer | Stable entities (`Trade`, `Markup`, `Session`) for a private backend |

Personas, RACI, and communication notes: [docs/02-stakeholders-raci.md](./docs/02-stakeholders-raci.md)

## Product principles (constraints)

1. **No money fields** — no balances, lot size, commission, or profit in currency (see FR-024, BR-01).
2. **Planned vs achieved R** — planned risk-to-reward (e.g. `1:3`) is separate from achieved R (+2.4R, −1R, 0) so intent compares to execution.
3. **Append-only journal** — markup bodies are not edited or deleted; observations are **appended** as updates for accountability.

Full business context: [docs/01-context.md](./docs/01-context.md)

## Analysis artifacts (`docs/`)

| Document | Contents |
|----------|----------|
| [01-context.md](./docs/01-context.md) | Problem, scope, assumptions, success measures |
| [02-stakeholders-raci.md](./docs/02-stakeholders-raci.md) | Stakeholders, personas, RACI |
| [03-requirements.md](./docs/03-requirements.md) | Functional & non-functional requirements (IDs) |
| [04-use-cases-stories.md](./docs/04-use-cases-stories.md) | Use cases, user stories, acceptance criteria |
| [05-process-as-is-to-be.md](./docs/05-process-as-is-to-be.md) | Mermaid: legacy journaling vs JournalX flow |
| [06-data-model.md](./docs/06-data-model.md) | ERD: Trade, Markup, Pair, Session, Setup |
| [07-sequence-flows.md](./docs/07-sequence-flows.md) | Plan → execute → review; append-only markup |
| [08-traceability-matrix.md](./docs/08-traceability-matrix.md) | Requirement → design → code → tests |
| [09-acceptance-tests.md](./docs/09-acceptance-tests.md) | Manual acceptance checklist |

## Working demo (prototype validation)

The React app implements the UX and business rules against **sample trade data**. Markups persist in **localStorage**; new trades from Add trade remain demo-only until a backend exists.

**UX highlights:** history quick filters, plan-adherence views, filtered JSON export, keyboard shortcuts (`?`, `/`, `Ctrl+E`), dashboard period R delta, setup quick picks on add-trade, and append-only journal polish.

**Run locally** (Node.js and npm):

```bash
git clone https://github.com/jah-guide/journalx-dashboard.git
cd journalx-dashboard
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

**Build:**

```bash
npm run build
```

**GitHub Pages** (static prerender to `dist/client`, publish `gh-pages` branch):

```bash
npm run publish:gh-pages
```

Uses `VITE_BASE=/journalx-dashboard/` for asset paths under [GitHub Pages project sites](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#types-of-github-pages-sites).

### What the demo covers

- **Dashboard** — period-filtered R, win rate, cumulative curve, session/pair breakdowns
- **Journal** — today-first markups, search/filter, append-only updates
- **Add trade** — two-stage plan / complete flow with validation
- **Trade history** — chips, plan-adherence filter, export JSON, copy trade link, trade detail
- **Analytics** — planned vs achieved R, plan adherence, breakdowns by pair/session/setup

### Current limitation (stated honestly)

| Area | Behavior in v0 |
|------|----------------|
| Trade history & analytics | Read from **seed data** in `src/lib/trades.ts` |
| Add trade | Validates and confirms via toast; **does not persist** new rows to history after refresh |
| Journal markups | New markups and updates live in **browser session state** until refresh |

These gaps are tracked as NFR-004 in [docs/03-requirements.md](./docs/03-requirements.md) and AT-103 in [docs/09-acceptance-tests.md](./docs/09-acceptance-tests.md). Roadmap: private backend, image storage, optional trade↔markup link, Discord publishing.

## Tech stack (validation only)

- Vite, React, TypeScript
- TanStack Start / Router
- Tailwind CSS

Stack choice supports fast iteration on forms, filters, and charts while requirements remain the source of truth.
