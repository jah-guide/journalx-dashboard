# Data model — JournalX

## Purpose of this document

Define core entities, attributes, and relationships for trades and journal markups. Aligns with prototype types in `src/lib/trades.ts` and `src/lib/journal.ts`.

---

## Entity summary

| Entity | Description |
|--------|-------------|
| **Trade** | One planned and optionally completed trade in R terms |
| **Markup** | Pair-specific journal entry for a calendar day |
| **MarkupUpdate** | Append-only child record on a markup |
| **Pair** | Instrument symbol from a fixed catalog (e.g. EUR/USD) |
| **Session** | Trading session enum: Asian, London, New York |
| **Setup** | Free-text strategy tag on a trade (not normalized in v0) |

---

## ERD (logical)

```mermaid
erDiagram
  TRADE {
    string id PK
    date trade_date
    string pair FK
    string session FK
    string outcome "Win|Loss|Breakeven|null"
    string planned_reward "e.g. 1:3"
    boolean followed_plan
    float achieved_r "R-multiple"
    string setup
    text plan_notes
    text review_notes
    string before_screenshot_url
    string after_screenshot_url
  }

  MARKUP {
    string id PK
    date markup_date
    string pair FK
    string title
    text body
    string tag "Premarket|Session plan|Observation|Review"
  }

  MARKUP_UPDATE {
    string id PK
    string markup_id FK
    text body
    datetime created_at
  }

  MARKUP_IMAGE {
    string id PK
    string markup_id FK
    string image_url
    int sort_order
  }

  UPDATE_IMAGE {
    string id PK
    string update_id FK
    string image_url
  }

  PAIR {
    string symbol PK
  }

  SESSION {
    string name PK "Asian|London|New York"
  }

  PAIR ||--o{ TRADE : "traded"
  SESSION ||--o{ TRADE : "during"
  PAIR ||--o{ MARKUP : "analyzed"
  MARKUP ||--o{ MARKUP_UPDATE : "appends"
  MARKUP ||--o{ MARKUP_IMAGE : "has"
  MARKUP_UPDATE ||--o{ UPDATE_IMAGE : "has"
```

**Note:** In the v0 frontend, `Markup.images` and update images are string arrays rather than normalized `MARKUP_IMAGE` rows; the ERD shows the target persistence shape.

---

## Trade — data dictionary

| Attribute | Type | Required | Rules |
|-----------|------|----------|-------|
| id | string | Yes | Unique, e.g. `T-001` |
| date | ISO date | Yes | Trade day (time may extend to datetime in UI) |
| pair | string | Yes | Must be in pair catalog |
| session | Session | Yes | Asian \| London \| New York |
| outcome | enum | No until complete | Win, Loss, Breakeven |
| plannedReward | string | Yes | Risk-to-reward label, e.g. `1:3` — not currency |
| followedPlan | boolean | No | Used for plan adherence analytics |
| r | number | When complete | Achieved R; losses typically −1 |
| setup | string | No | e.g. Liquidity sweep |
| planNotes | text | No | Thesis before entry |
| reviewNotes | text | No | Post-trade reflection |
| beforeScreenshot | url | No | Chart at plan/entry |
| afterScreenshot | url | No | Chart after exit |

**Excluded by policy:** balance, profit_currency, lot_size, commission (BR-01).

---

## Markup — data dictionary

| Attribute | Type | Required | Rules |
|-----------|------|----------|-------|
| id | string | Yes | Unique, e.g. `M-024` |
| date | ISO date | Yes | Usually “today” on create |
| pair | string | Yes | From pair catalog |
| title | string | Yes | Short idea label |
| body | text | Yes | Bias, levels, invalidation |
| tag | enum | Yes | Premarket, Session plan, Observation, Review |
| images | string[] | No | Multiple chart uploads |
| updates | MarkupUpdate[] | No | Append-only |

### MarkupUpdate

| Attribute | Type | Required | Rules |
|-----------|------|----------|-------|
| id | string | Yes | Unique |
| body | text | Conditional | Text and/or images |
| images | string[] | No | |
| createdAt | ISO datetime | Yes | Audit ordering |

---

## Pair catalog (reference)

Prototype list includes: EUR/USD, GBP/USD, USD/JPY, GBP/JPY, AUD/USD, USD/CAD, NZD/USD, EUR/JPY, XAU/USD, BTC/USD, ETH/USD, US30, NAS100 (see `PAIRS` in code).

---

## Related documents

- [07-sequence-flows.md](./07-sequence-flows.md)
- [03-requirements.md](./03-requirements.md)
