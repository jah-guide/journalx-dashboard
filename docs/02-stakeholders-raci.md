# Stakeholders and RACI — JournalX

## Purpose of this document

Identifies who cares about JournalX outcomes and who is responsible for analysis, delivery, and acceptance—supporting portfolio review as a **Systems Analyst / product analysis** artifact.

## Stakeholder map

| Stakeholder | Interest | Primary outcome |
|-------------|----------|-----------------|
| **Independent trader** (primary user) | Honest process review without dollar fixation | Plan → execute → review loop in R only |
| **Trading coach / mentor** (secondary) | Read-only view of plans vs results | Evidence of plan adherence and journal discipline |
| **Product owner** (portfolio: jah-guide) | Showcase requirements → working prototype | Complete `docs/` pack + runnable demo |
| **Recruiter / hiring manager** | Requirements traceability and domain clarity | SA-led README and linked analysis |
| **Future backend engineer** | Stable domain model and NFRs | ERD, sequences, FR IDs for API design |

## Personas (condensed)

### Alex — discretionary session trader

- Trades FX, indices, and crypto during London/NY overlap.
- Frustrated by journals that only show “+$420” with no plan context.
- Needs: today-first journal, pending vs completed trades, filters by setup and session.

### Sam — mentor (read-only, future)

- Reviews mentee journals weekly.
- Needs: immutable markup history, clear planned vs achieved R on each trade.

## RACI matrix

Legend: **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

| Activity | Trader (Alex) | Product owner | SA / analyst | Developer | Recruiter |
|----------|---------------|---------------|--------------|-----------|-----------|
| Define business problem & principles | C | A | R | I | I |
| Elicit functional requirements | R | A | R | C | I |
| Approve scope / non-goals | C | A | R | I | I |
| Process as-is / to-be diagrams | I | A | R | C | I |
| Data model & sequence flows | C | A | R | R | I |
| Build UI prototype | I | A | C | R | I |
| Acceptance test sign-off (demo) | R | A | R | C | I |
| Portfolio presentation | I | R | R | I | C |

## Communication notes

- **Trader ↔ product**: Principles (no money, append-only) are non-negotiable constraints, not nice-to-haves.
- **Analyst ↔ developer**: `Trade`, `Markup`, and session enums in `src/lib/trades.ts` and `src/lib/journal.ts` are the canonical prototype entities until a backend exists.
- **Honest limitation**: v0 uses in-memory and seed data; stakeholder expectations for persistence are documented in README and NFR-004.

## Related documents

- [01-context.md](./01-context.md)
- [03-requirements.md](./03-requirements.md)
- [09-acceptance-tests.md](./09-acceptance-tests.md)
