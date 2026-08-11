import chart1 from "@/assets/chart-1.jpg";
import chart2 from "@/assets/chart-2.jpg";
import chart3 from "@/assets/chart-3.jpg";

export type Markup = {
  id: string;
  date: string;
  pair: string;
  title: string;
  body: string;
  tag: "Premarket" | "Session plan" | "Observation" | "Review";
  images: string[];
  updates?: { id: string; body: string; images: string[]; createdAt: string }[];
};

export const markups: Markup[] = [
  { id: "M-024", date: "2026-08-10", pair: "EUR/USD", title: "New York reaction zone", body: "Watching for a reaction around the prior-day low. Bearish only if price rejects the level with displacement.", tag: "Session plan", images: [chart1] },
  { id: "M-023", date: "2026-08-10", pair: "GBP/USD", title: "London liquidity map", body: "Asian range high is the draw. I want a sweep and a clean shift before looking for a long.", tag: "Premarket", images: [chart2, chart3] },
  { id: "M-022", date: "2026-08-09", pair: "NAS100", title: "Opening drive idea", body: "Marking the first 30-minute range. No trade inside the range; only a retest after a convincing break.", tag: "Session plan", images: [chart3] },
  { id: "M-021", date: "2026-08-08", pair: "US30", title: "No-trade day", body: "High-impact news and compressed price action. Staying out unless the market gives a very clean post-news setup.", tag: "Observation", images: [] },
];
