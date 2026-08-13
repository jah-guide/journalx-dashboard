# JournalX

JournalX is a dark, focused trading journal for reviewing ideas, logging executions, and learning from performance without tracking money. Results are measured in risk-to-reward and R only.

## What it includes

- **Dashboard** — total R, win rate, best session, cumulative performance, recent trades, and pair/session breakdowns.
- **Journal** — a today-first workspace for pair-specific market markups, analysis, and multiple chart uploads. Previous markups are preserved as a read-only accountability record, with append-only updates.
- **Add Trade** — one trade has a before and after stage: plan the idea, attach a before chart, then record the result and an optional after chart.
- **Trade History** — searchable trade records with filters for pair, session, outcome, setup, date range, and review status.
- **Analytics** — results by pair, session, and setup; planned versus achieved reward; plan adherence; and small-sample guidance.

## Product principles

- No money, balances, or profit-currency fields.
- Planned risk-to-reward and achieved R are separate so intent can be compared with execution.
- Journal entries and their updates are not edited or deleted after saving, preserving a truthful record for review.
- The current version is frontend-only and uses local sample data.

## Run locally

You need Node.js and npm installed.

```bash
git clone https://github.com/jah-guide/journalx-dashboard.git
cd journalx-dashboard
npm install
npm run dev
```

Open the local address shown by Vite in your browser.

## Build

```bash
npm run build
```

## Roadmap

- Persist trades, markups, images, and append-only updates in a private backend.
- Link a trade directly to the markup that informed it.
- Add optional Discord publishing for saved markups and trade ideas.
- Add personal accounts when JournalX is ready to support more traders.

## Built with

- React and TypeScript
- TanStack Start / Router
- Tailwind CSS
- Vite
