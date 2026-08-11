# JournalX Dashboard

Build a responsive frontend prototype for a personal trading journal web app called “JournalX”.

Style: dark, premium, minimal, and focused. Avoid the cluttered feel of Notion. Use a near-black background, charcoal panels, soft borders, clean modern typography, and a subtle lime-green accent for positive performance.

Create these pages/views:

Dashboard

Welcome heading and a simple summary.

Metrics: total R, win rate, total trades, best trading session.

Recent trades list with pair, session, outcome, R-multiple, and a small chart screenshot thumbnail.

A performance chart showing cumulative R over time.

Simple breakdown cards for performance by session and by currency pair.

Add Trade

Searchable/selectable trading pair field.

Session selector: Asian, London, New York.

Outcome selector: Win, Loss, Breakeven.

R-multiple input only. Do not include money, account balance, or currency profit fields.

Optional setup/tag and notes.

Screenshot upload area with preview.

Save Trade button.

Trade History

Clean table or card list of saved trades.

Search and filters for pair, session, outcome, and date.

Each trade can open into a detail view with notes and screenshot.

Analytics

Win rate and average R by trading pair.

Win rate and average R by session.

Wins, losses, breakevens, and cumulative R trend.

Use realistic sample data so the prototype feels alive. Make it mobile responsive. This is frontend only for now: use local mock data and do not add authentication, backend, database, payments, or server logic.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9e74c15c-a328-41df-a057-fa3083ace3a9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
