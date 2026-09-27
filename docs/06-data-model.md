# Data model — JournalX

Core entities for trades and journal markups. Aligns with `src/lib/trades.ts` and `src/lib/journal.ts`.

---

## Entities

| Entity | Role |
|--------|------|
| **Trade** | Planned and optionally completed trade in R terms |
| **Markup** | Pair-specific journal entry for a calendar day |
| **MarkupUpdate** | Append-only note on a markup |
| **Pair** | Instrument from catalog (e.g. EUR/USD) |
| **Session** | Asian, London, New York |

---

## ERD (logical)

```mermaid
erDiagram
  TRADE ||--|| PAIR : pair
  TRADE ||--|| SESSION : session
  MARKUP ||--|| PAIR : pair
  MARKUP ||--o{ MARKUP_UPDATE : appends

  TRADE {
    string id
    date trade_date
    string outcome
    string planned_reward
    float achieved_r
    text plan_notes
    text review_notes
  }

  MARKUP {
    string id
    date markup_date
    string title
    text body
    string tag
  }

  MARKUP_UPDATE {
    string id
    text body
    datetime created_at
  }
```

**v0 note:** Frontend uses `images: string[]` on markups/updates instead of separate image tables.

---

## Trade attributes

| Field | Required | Notes |
|-------|----------|-------|
| id | Yes | e.g. `T-001` |
| date | Yes | Trade day |
| pair, session | Yes | From catalogs |
| plannedReward | Yes | e.g. `1:3` — not currency |
| outcome | When complete | Win \| Loss \| Breakeven |
| r (achieved) | When complete | R-multiple; losses often −1 |
| setup, planNotes, reviewNotes | No | Free text |
| before/after screenshot | No | Chart URLs |

**Excluded:** balance, profit_currency, lot_size, commission (BR-01).

---

## Markup attributes

| Field | Required | Notes |
|-------|----------|-------|
| id, date, pair, title, body, tag | Yes | Tag: Premarket, Session plan, Observation, Review |
| images | No | Chart uploads |
| updates | No | Append-only `{ id, body, images?, createdAt }` |

Original `body` is never edited in the UI — only updates are added (BR-03).

---

## Pair catalog

EUR/USD, GBP/USD, USD/JPY, GBP/JPY, AUD/USD, USD/CAD, NZD/USD, EUR/JPY, XAU/USD, BTC/USD, ETH/USD, US30, NAS100 (`PAIRS` in code).

---

## Related documents

- [07-sequence-flows.md](./07-sequence-flows.md)
- [03-requirements.md](./03-requirements.md)
