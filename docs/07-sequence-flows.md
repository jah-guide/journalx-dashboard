# Sequence flows — JournalX

Interaction order for **plan → execute (external) → review** and **append-only markup**.

---

## SF-01 — Plan → review trade

```mermaid
sequenceDiagram
  actor Trader
  participant UI as JournalX UI
  participant Store as Data (seed / state)

  Trader->>UI: Add trade — plan fields, optional pending save
  UI->>Store: Save pending or wait
  Note over Trader: Execute on broker (out of app)
  Trader->>UI: Complete — outcome, achieved R, review
  UI->>Store: Save completed trade
  Trader->>UI: History / Analytics
  Store-->>UI: Planned R:R vs achieved R
```

**Maps to:** FR-020–FR-023, FR-030, FR-041

**Prototype:** Add trade validates and toasts; history/analytics read static `trades` until persistence (NFR-004).

---

## SF-02 — New markup (today)

```mermaid
sequenceDiagram
  actor Trader
  participant UI as Journal
  participant State as markups[]

  Trader->>UI: New markup — pair, tag, title, body, images
  UI->>State: Prepend markup (date = today)
  State-->>Trader: Listed under Previous markups
```

**Maps to:** FR-010, FR-013

---

## SF-03 — Append-only update

```mermaid
sequenceDiagram
  actor Trader
  participant UI as Journal
  participant State as markups[]

  Trader->>UI: Add update on saved markup
  UI->>State: Push to markup.updates[]
  Note over State: markup.body unchanged
  UI-->>Trader: Update block under original
```

No edit/delete path for the original markup (FR-012, BR-03).

---

## SF-04 — Dashboard read

```mermaid
sequenceDiagram
  actor Trader
  participant Dash as Dashboard
  participant Lib as stats / cumulative

  Trader->>Dash: Period 7 / 30 / all
  Dash->>Lib: Filter by date window
  Lib-->>Dash: Metrics + chart + recent trades
```

**Maps to:** FR-001, FR-002

---

## Related documents

- [05-process-as-is-to-be.md](./05-process-as-is-to-be.md)
- [06-data-model.md](./06-data-model.md)
- [04-use-cases-stories.md](./04-use-cases-stories.md)
