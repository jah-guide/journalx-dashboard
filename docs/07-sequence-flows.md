# Sequence flows — JournalX

## Purpose of this document

Describe interaction order for the core lifecycle **plan trade → execute (external) → review**, plus **append-only markup** updates.

---

## SF-01 — Plan trade → execute → review

```mermaid
sequenceDiagram
  actor Trader
  participant UI as JournalX UI
  participant Store as Data layer (v0: seed / session state)
  participant Broker as Broker platform

  Note over Trader,Broker: Phase 1 — Plan (in app)
  Trader->>UI: Open Add trade
  Trader->>UI: Enter pair, session, planned R:R, plan notes, before chart
  UI->>UI: Validate required plan fields
  alt Outcome not set
    UI->>Store: Save pending trade (future: persist)
    Store-->>UI: Ack
    UI-->>Trader: Toast: pending trade saved
  end

  Note over Trader,Broker: Phase 2 — Execute (outside app)
  Trader->>Broker: Place and manage order
  Broker-->>Trader: Fill / exit

  Note over Trader,Store: Phase 3 — Review (in app)
  Trader->>UI: Complete same trade (or new form with outcome)
  Trader->>UI: Outcome, achieved R, review notes, after chart
  UI->>UI: Validate achieved R when outcome set
  UI->>Store: Save completed trade
  Store-->>UI: Ack
  UI-->>Trader: Toast: ready for review

  Trader->>UI: Open History / Analytics
  UI->>Store: Read trades
  Store-->>UI: Trade list
  UI-->>Trader: Show planned R:R vs achieved R
```

**Requirement mapping:** FR-020–FR-023, FR-030, FR-041

**Prototype note:** Add trade currently validates and toasts; trade list for history/analytics reads from static `trades` seed until backend persistence (NFR-004).

---

## SF-02 — Morning markup (today-first)

```mermaid
sequenceDiagram
  actor Trader
  participant UI as Journal page
  participant State as React state (markups[])

  Trader->>UI: Expand New markup
  Trader->>UI: Select pair, tag, title, body, images
  UI->>UI: Validate title and body
  Trader->>UI: Submit Save today's markup
  UI->>State: Prepend new Markup (id, date=today)
  State-->>UI: Updated list
  UI-->>Trader: Markup visible in Previous markups
```

**Requirement mapping:** FR-010, FR-013

---

## SF-03 — Append-only markup update

```mermaid
sequenceDiagram
  actor Trader
  participant UI as Journal page
  participant State as React state

  Trader->>UI: Open saved markup
  Trader->>UI: Click Add update
  Trader->>UI: Enter observation text and/or upload charts
  UI->>UI: Validate non-empty body or images
  Trader->>UI: Save update
  UI->>State: Append to markup.updates[] (immutable body)
  Note over State: Original markup.body unchanged
  State-->>UI: Re-render with Update section
  UI-->>Trader: Update shown under original content

  Note over Trader,UI: No edit/delete path for original markup
```

**Requirement mapping:** FR-012, NFR-003, BR-03

---

## SF-04 — Dashboard read path

```mermaid
sequenceDiagram
  actor Trader
  participant Dash as Dashboard
  participant Lib as stats / groupBy / cumulative

  Trader->>Dash: Select period 7/30/all
  Dash->>Lib: Filter trades by date window
  Lib-->>Dash: Aggregates and series
  Dash-->>Trader: Metrics, chart, recent trades
```

**Requirement mapping:** FR-001, FR-002

---

## Related documents

- [05-process-as-is-to-be.md](./05-process-as-is-to-be.md)
- [06-data-model.md](./06-data-model.md)
- [04-use-cases-stories.md](./04-use-cases-stories.md)
