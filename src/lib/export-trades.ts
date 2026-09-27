import type { Trade } from "@/lib/trades";

export type TradesExportPayload = {
  exportedAt: string;
  schema: "journalx/trades-v1";
  count: number;
  trades: Trade[];
};

export function buildTradesExport(trades: Trade[]): TradesExportPayload {
  return {
    exportedAt: new Date().toISOString(),
    schema: "journalx/trades-v1",
    count: trades.length,
    trades,
  };
}

export function downloadTradesJson(trades: Trade[], filename?: string): void {
  const payload = buildTradesExport(trades);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download =
    filename ??
    `journalx-trades-${new Date().toISOString().slice(0, 10)}-${trades.length}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
