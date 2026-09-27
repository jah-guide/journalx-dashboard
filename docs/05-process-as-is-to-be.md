# Process — as-is vs to-be (trader journaling)

Why JournalX emphasizes **R**, **planning**, and **append-only** records.

---

## As-is: ad-hoc journaling

Typical flow when P&amp;L and spreadsheets drive the habit:

```mermaid
flowchart LR
  A[Trade from memory] --> B[Broker]
  B --> C[Check dollar P/L]
  C --> D{Win?}
  D -->|Yes| E[Maybe log screenshot]
  D -->|No| F[Skip or rewrite story]
  E --> G[Spreadsheet / notes]
  F --> G
  G --> H[Review: balance only]
```

**Pain points:** plan lives in chat or deleted markup; entries get edited; success in account currency; session/setup edge hidden.

---

## To-be: JournalX loop

```mermaid
flowchart LR
  subgraph Plan
    P1[Journal markup] --> P2[Add trade plan]
  end
  subgraph Review
    R1[Complete outcome + R] --> R2[Append updates]
  end
  subgraph Learn
    L1[History filters] --> L2[Analytics planned vs achieved]
  end
  Plan --> Review --> Learn --> Plan
```

Broker execution stays **outside** the app between plan and review.

**Improvements:**

| As-is gap | To-be behavior |
|-----------|----------------|
| Dollar fixation | R-multiples and planned R:R only (BR-01) |
| Plan discarded | Pending trade + plan notes + before chart (FR-020, FR-021) |
| Rewritten history | Append-only markup updates (FR-012, BR-03) |
| Weak retrospectives | History + analytics by pair, session, setup (FR-030, FR-043) |

---

## Swimlane (compact)

```mermaid
flowchart TB
  T1[Write markup] --> J1[Store append-only]
  T2[Plan trade] --> J2[Store plan]
  T3[Execute on broker] -.-> T4[Log result]
  T4 --> J2
  J2 --> J3[Aggregate R stats]
  J3 --> T5[Review analytics]
```

---

## Related documents

- [01-context.md](./01-context.md)
- [07-sequence-flows.md](./07-sequence-flows.md)
- [03-requirements.md](./03-requirements.md)
