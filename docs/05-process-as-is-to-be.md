# Process — as-is vs to-be (trader journaling)

## Purpose of this document

Contrast typical **ad-hoc trader journaling (as-is)** with the **JournalX target process (to-be)** to show why requirements emphasize R, planning, and append-only records.

---

## As-is: trader journaling today

Common pattern when P&amp;L and spreadsheets drive the habit:

```mermaid
flowchart TD
  A[Market opens] --> B[Trade from memory or chat]
  B --> C[Execute on broker]
  C --> D[Check dollar P and L]
  D --> E{Win?}
  E -->|Yes| F[Log win and screenshot optionally]
  E -->|No| G[Skip journal or rewrite story]
  F --> H[Spreadsheet or notes app]
  G --> H
  H --> I[Monthly review: win rate and balance only]
  I --> J[No link between morning plan and exit]
```

**Pain points:**

- Planning lives in head, Discord, or deleted chart markup.
- Journal entries edited after the fact; hindsight bias.
- Success measured in account currency, not risk-normalized R.
- Session/setup edge is invisible in aggregates.

---

## To-be: JournalX process

Process the product is designed to enforce:

```mermaid
flowchart TD
  subgraph Plan["Plan (before session)"]
    P1[Journal: markup for pair] --> P2[Tag: Premarket / Session plan]
    P2 --> P3[Optional chart uploads]
  end

  subgraph Execute["Execute"]
    E1[Add trade: before section] --> E2[Planned R:R and thesis]
    E2 --> E3[Save pending OR enter live]
    E3 --> E4[Trade on broker - outside app]
  end

  subgraph Review["Review (after exit)"]
    R1[Complete trade: outcome and achieved R]
    R1 --> R2[Review notes and after chart]
    R2 --> R3[Append journal update if bias changed]
  end

  subgraph Learn["Learn"]
    L1[History filters by setup and session]
    L1 --> L2[Analytics: planned vs achieved R]
    L2 --> L3[Dashboard: cumulative R trend]
  end

  Plan --> Execute
  Execute --> Review
  Review --> Learn
  Learn --> Plan
```

**Improvements:**

| As-is gap | To-be behavior |
|-----------|----------------|
| Dollar fixation | R-multiples and planned R:R only (BR-01) |
| Plan discarded | Pending trade + plan notes + before chart (FR-020, FR-021) |
| Rewritten history | Append-only markup updates (FR-012, BR-03) |
| Weak retrospectives | History + analytics by pair, session, setup (FR-030, FR-043) |

---

## Swimlane (optional view)

```mermaid
flowchart LR
  subgraph Trader
    T1[Write markup]
    T2[Plan trade]
    T3[Execute externally]
    T4[Log result]
    T5[Review analytics]
  end
  subgraph JournalX
    J1[Store markup append-only]
    J2[Store trade plan and result]
    J3[Aggregate R stats]
  end
  T1 --> J1
  T2 --> J2
  T4 --> J2
  J2 --> J3
  T3 -.->|out of scope| T4
  J3 --> T5
```

---

## Related documents

- [01-context.md](./01-context.md)
- [07-sequence-flows.md](./07-sequence-flows.md)
- [03-requirements.md](./03-requirements.md)
